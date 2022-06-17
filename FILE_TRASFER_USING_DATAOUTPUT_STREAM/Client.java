import java.io.*;
import java.net.*;
import java.awt.*;
import java.util.*;
import javax.swing.*;
import java.awt.event.*;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.concurrent.atomic.AtomicBoolean;

class ServerDisconnected extends Exception {
    public ServerDisconnected(String s) {
        // Call constructor of parent Exception
        super(s);
    }
}

class ClientDirectoryToServerUpdater extends Thread {

    DataOutputStream dos;
    final Object lock = new Object();
    static boolean connection = true;
    static String fileCollectionExisting = "";
    AtomicBoolean statusBlockFlag = new AtomicBoolean(false);
    Logger logger = Logger.getLogger(ClientDirectoryToServerUpdater.class.getName());

    public ClientDirectoryToServerUpdater(DataOutputStream dos) {
        this.dos = dos;
    }

    public void run() {
        try {

            Client.infolog("ClientDirectoryToServerUpdater Started...", logger);

            File[] files;
            int timmer = 20; // so that dos of server and dos of client do not clash
            String fileCollection = "";
            File currentDirectory = new File("./");

            // Best Practice to write the wait in Monitoring Thread
            while (true) {

                sleep(timmer);
                timmer = 1300;
                fileCollection = "";

                if (!Client.connectedWithServer) {
                    ClientDirectoryToServerUpdater.connection = false;
                    throw new ServerDisconnected("ServerDisconnected");

                }

                if (this.statusBlockFlag.get()) {
                    synchronized (lock) {
                        lock.wait();
                    }
                }
                files = currentDirectory.listFiles();
                for (File file : files) {
                    if (file.isFile()) {
                        fileCollection += file.getName() + "\n";
                    }
                }
                fileCollection=fileCollection.replaceAll(Client.clientSourceFiles,"");
                fileCollection = fileCollection.replaceAll(Client.serverSourceFiles, "");
                

                if ((!ClientDirectoryToServerUpdater.fileCollectionExisting.equals(fileCollection))
                        || !ClientDirectoryToServerUpdater.connection) {
                    // If change in file detected will intiminate the client
                    ClientDirectoryToServerUpdater.connection = true;
                    ClientDirectoryToServerUpdater.fileCollectionExisting = fileCollection;
                    this.dos.writeUTF("ClientContinousFiles");
                    this.dos.flush();
                    this.dos.writeUTF(fileCollection);
                    this.dos.flush();

                }

            }

        } catch (IOException | InterruptedException | ServerDisconnected e) {
            // e.printStackTrace();
            Client.infolog("Server Terminated Abruptly", logger);
        }

        finally {
            Client.infolog("ClientDirectoryToServerUpdater thread Ended", logger);

        }
    }
}

class ClientFileStatusInClientStorage extends Thread {

    JTextArea serverFiles;
    final Object lock = new Object();
    Logger logger = Logger.getLogger(ClientFileStatusInClientStorage.class.getName());
    static AtomicBoolean statusBlockFlag = new AtomicBoolean(true);

    public Object getLock() {

        return this.lock;
    }

    public ClientFileStatusInClientStorage(JTextArea serverFiles) {

        this.serverFiles = serverFiles;
    }

    public void run() {
        try {

            System.out.println("Client Status thread Running...");

            int timmer = 10;
            File[] files;
            String fileCollection = "";
            File currentDirectory = new File("./");
            

            // If this pathname does not denote a directory, then listFiles() returns null.
            // Best Practice to write the wait in Monitoring Thread
            while (true) {

                sleep(timmer);
                timmer = 1300;
                // Thread waits when files in server Directory is needed
                if (ClientFileStatusInClientStorage.statusBlockFlag.get()) {
                    synchronized (lock) {
                        lock.wait();
                    }
                }
                files = currentDirectory.listFiles();
                for (File file : files) {
                    if (file.isFile()) {
                        fileCollection += file.getName() + "\n";
                    }
                }


                fileCollection = fileCollection.replaceAll(Client.clientSourceFiles, "");
                fileCollection = fileCollection.replaceAll(Client.serverSourceFiles, "");
                serverFiles.setText(fileCollection);
                fileCollection = "";

            }

        } catch (Exception e) {
            // e.printStackTrace();
            Client.warninglog("Exiting From the thread:- ClientFileStatusInClientStorage ", logger);

        }
    }

}

public class Client {

    Socket s;
    DataInputStream dis;
    DataOutputStream dos;

    JLabel title;
    JTextField fileName;
    JTextArea serverFiles;
    String ServerContinousFiles = "";
    String AssignedClientNumber = "";
    JFrame jf = new JFrame("Receiver");
    File currentDirectory = new File("./");
    String options[] = { "Server", "Client" };
    static Boolean ansiColorSupported = false;
    static boolean connectedWithServer = false;
    public static final String ANSI_RED = "\u001B[31m";
    public static final String ANSI_BLUE = "\u001B[34m";
    public static final String ANSI_RESET = "\u001B[0m";
    ClientDirectoryToServerUpdater clientContinousToServer;
    Logger logger = Logger.getLogger(Client.class.getName());
    AtomicBoolean uploadStatus = new AtomicBoolean(false);
    JComboBox<String> serverClientChoice = new JComboBox<String>(options);
    static String clientSourceFiles = "Client.java\n|Client.class\n|Client.[0-9]*.class\n|ClientDirectoryToServerUpdater.class\n|ClientDisconnected.class\n|ClientFileStatusInClientStorage.class\n";
    static String serverSourceFiles = "Server.java\n|Server.class\n|Server.[0-9]*.class\n|ServerDirectoryToClientUpdater.class\n|ServerDisconnected.class\n|ClientFileStatusInServerStorage.class\n|ClientHandler.class\n";
    static void infolog(String s, Logger logger) {
        if (!Client.ansiColorSupported) {
            logger.log(Level.INFO, s);
        } else {
            logger.log(Level.INFO, (ANSI_BLUE + s + ANSI_RESET));
        }

    }

    static void warninglog(String s, Logger logger) {
        if (!Client.ansiColorSupported) {
            logger.log(Level.INFO, s);
        } else {
            logger.log(Level.INFO, (ANSI_RED + s + ANSI_RESET));
        }
    }

    void client_start() {
        try {
            String str;
            s = new Socket("localhost", 6666);

            Client.infolog("Connected to Server", logger);

            dos = new DataOutputStream(s.getOutputStream());
            dis = new DataInputStream(s.getInputStream());

            dos.writeUTF(currentDirectory.getAbsolutePath());
            dos.flush();
            String temp = dis.readUTF();

            // client number should not change when server is restarted
            if (AssignedClientNumber.equals("")) {
                AssignedClientNumber = temp;
                title.setText("TCP CLIENT(" + AssignedClientNumber + ")");
            }

            // semding existing or new client number
            dos.writeUTF(AssignedClientNumber);
            dos.flush();

            str = (String) dis.readUTF();

            if (str.equals("Rejected")) {
                Client.warninglog(str, logger);
                Client.warninglog("Client already running on the folder", logger);
                jf.dispose();
                System.exit(0);
            } else {
                Client.infolog(str, logger);
                Client.connectedWithServer = true;
                // if server restablish connection need to start again
                clientContinousToServer = new ClientDirectoryToServerUpdater(this.dos);
                clientContinousToServer.start();

                while (true) {
                    // waiting for receiving
                    str = (String) dis.readUTF();
                    System.out.println("Server:- "+str);

                    if (str.equals("UploadingFileFrom_Server")) {
                        // get series of uploaded files
                        String filename = (String) dis.readUTF();

                        long filesize = dis.readLong();

                        File tempfile = new File("./" + filename);
                        if (!tempfile.exists()) {
                            tempfile.createNewFile();
                        }

                        if (filesize == 0) {
                            str = (String) dis.readUTF();
                            Client.infolog(str,logger);
                        } else {
                            FileWriter writingFile = new FileWriter(tempfile);

                            int ch;
                            for (long i = 0; i < filesize; i++) {
                                ch = (int) dis.readByte();
                                writingFile.write(((ch - 3) % 256));
                            }

                            writingFile.close();

                            str = (String) dis.readUTF();
                            Client.infolog(str, logger);

                        }

                    } else if (str.equals("ServerContinousFiles")) {
                        str = (String) dis.readUTF();
                        ServerContinousFiles = str;
                        serverFiles.setText(str);

                    } else if (str.equals("clientRequest-DownloadfileError")) {
                        str = (String) dis.readUTF();
                        Client.warninglog(str, logger);

                    } else if (str.equals("ServerRequest-Downloadfile")) {
                        str = (String) dis.readUTF();
                        File serverRequest = new File("./" + str);
                        if (serverRequest.isFile()) {
                            // do upload
                            onUpload(str);

                        } else {
                            dos.writeUTF("ServerRequest-DownloadfileError");
                            dos.flush();
                            dos.writeUTF("File Not Present");
                            dos.flush();
                        }

                    } else {
                        continue;
                    }

                }
            }
        } catch (Exception e) {
            try {
                // e.printStackTrace();
                dos.close();
                dis.close();
                s.close();
                Client.connectedWithServer = false;
                Client.warninglog("Server Abruptly Terminated", logger);
                System.out.println("Reconnecting with Server");

            } catch (Exception e1) {
                Client.warninglog("Server Not Started", logger);
            } finally {
                client_start();
            }
        }
    }
    
    void resume() {
        try {
            if(this.clientContinousToServer!=null)
            {
            this.clientContinousToServer.statusBlockFlag.set(false);
            synchronized (this.clientContinousToServer.lock) {
                this.clientContinousToServer.lock.notify();
            }
           } 

        } catch (Exception e) {

        }
    }

    void onUpload(String fileNameText) {
        
        String serverSourceFilesTemp = Client.serverSourceFiles.replaceAll("\n", "");
        String clientSourceFilesTemp = Client.clientSourceFiles.replaceAll("\n", "");
        
        try {
            
            if (fileNameText != null&& !uploadStatus.get()) {

                uploadStatus.set(true);
                File tempfile = new File("./" + fileNameText);
                System.out.println(Client.class.getName() + ".java");
                if (tempfile.isFile()&& !(fileNameText.matches(serverSourceFilesTemp)||fileNameText.matches(clientSourceFilesTemp))) {

                    //blocking the sending of client current files to server before uploading
                    this.clientContinousToServer.statusBlockFlag.set(true);
                    dos.writeUTF("UploadingFileFrom_Client");
                    dos.flush();
                    dos.writeUTF(fileNameText);
                    dos.flush();

                    // encrypt and sent
                    FileReader ClientFileReader = new FileReader(tempfile);
                    long length = (long) tempfile.length();

                    dos.writeLong(length);
                    dos.flush();

                    if (length == 0) {

                        dos.writeUTF("CLIENT("+AssignedClientNumber+"):- Finished Sending");
                        dos.flush();
                        resume();

                    } else {

                        int ch;

                        while ((ch = ClientFileReader.read()) != -1) {
                            dos.write((char) ((ch + 3) % 256));
                        }
                        dos.flush();
                        ClientFileReader.close();
                        dos.writeUTF("CLIENT(" + AssignedClientNumber + "):- Finished Sending");
                        dos.flush();
                        resume();
                    }

                } else {
                    Client.warninglog("Cannot Upload", logger);
                }
                uploadStatus.set(false); // when upload finished
            } else {
                Client.warninglog("Cannot Upload", logger);
            }


        } catch (Exception e) {
            // decrypt and save
            resume();
            uploadStatus.set(false);//when upload finished
            Client.warninglog("Cannot Upload Server Issues", logger);
        }

        
    }

    void onDownload() {

        try {
            String temp = fileName.getText();
            if (temp != null && !temp.equals("")) {
                dos.writeUTF("clientRequest-Downloadfile");
                dos.flush();
                dos.writeUTF(temp);
                dos.flush();

            } else {
                Client.warninglog("Could Not Download", logger);
            }
        } catch (Exception e) {
            Client.warninglog("Could Not Download", logger);
        }

    }

    public Client() {

        jf.setLayout(null);

        serverFiles = new JTextArea();
        fileName = new JTextField();

        ClientFileStatusInClientStorage status1 = new ClientFileStatusInClientStorage(this.serverFiles);
        status1.start();

        JButton ju = new JButton("Upload");
        JButton jd = new JButton("Download");
        Insets insets = jf.getInsets();

        title = new JLabel("TCP CLIENT");
        title.setFont(new Font("Arial", Font.BOLD, 50));
        title.setBounds(260 + insets.left, 40 + insets.right, 800, 50);
        title.setForeground(Color.BLACK);

        JLabel title1 = new JLabel("Files in the Server Directory:");
        title1.setFont(new Font("Arial", Font.BOLD, 16));
        title1.setBounds(225 + insets.left, 110 + insets.right, 400, 50);

        serverClientChoice.setFont(new Font("Arial", Font.PLAIN, 18));
        serverClientChoice.setBounds(690 + insets.left, 120 + insets.right, 100, 30);
        serverClientChoice.setForeground(Color.BLACK);

        serverClientChoice.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {

                if (serverClientChoice.getSelectedItem().equals("Server")) {

                    // 0=> if server is selected then ClientFileStatusInClientStorage Should be
                    // Blocked
                    status1.statusBlockFlag.set(true);
                    serverFiles.setText(ServerContinousFiles);
                    title1.setText("Files Present in the Remote "
                            + serverClientChoice.getSelectedItem().toString() + " Directory:");

                } else {
                    // 1=> Resume thread ClientFileStatusInClientStorage

                    ClientFileStatusInClientStorage.statusBlockFlag.set(false);
                    synchronized (status1.lock) {
                        status1.lock.notify();
                    }
                    title1.setText("Files Stored in the this Client Directory:");
                }
                serverFiles.setCaretPosition(0);
                
            }
        });

        serverFiles.setFont(new Font("Arial", Font.PLAIN, 18));
        serverFiles.setLineWrap(true);
        serverFiles.setEditable(false);
        JScrollPane serverFilesScroll = new JScrollPane(serverFiles);
        serverFilesScroll.setSize(400, 216);
        serverFilesScroll.setLocation(240 + insets.left, 180 + insets.right);

        JLabel fileNameText = new JLabel("Enter File Name:");
        fileNameText.setFont(new Font("Arial", Font.PLAIN, 18));
        fileNameText.setBounds(90 + insets.left, 440 + insets.right, 800, 50);

        fileName.setSize(480, 50);
        fileName.setFont(new Font("Arial", Font.PLAIN, 18));
        fileName.setLocation(350 + insets.left, 440 + insets.right);

        ju.setSize(200, 50);
        ju.setFont(new Font("Arial", Font.PLAIN, 18));
        ju.setLocation(190 + insets.left, 540 + insets.right);

        jd.setSize(200, 50);
        jd.setFont(new Font("Arial", Font.PLAIN, 18));
        jd.setLocation(490 + insets.left, 540 + insets.right);

        jf.add(title);
        jf.add(title1);
        jf.add(serverClientChoice);
        jf.add(serverFilesScroll);
        jf.add(ju);
        jf.add(jd);
        jf.add(fileName);
        jf.add(fileNameText);

        ju.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                String fileNameText = fileName.getText();
                onUpload(fileNameText);
            }
        });
        jd.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                onDownload();
            }
        });

        jf.setSize(900, 700);
        jf.setLocation(1000, 100);
        jf.setVisible(true);
        jf.setDefaultCloseOperation(3);
        // starting client Server
        client_start();

    }

    public static void main(String[] args) {

        // If ANSI Color to support on windows setup EnvironmentalVariable "TERM" to SET
        // And in registry [HKEY_CURRENT_USER\Console] 
        // and Add new dword VirtualTerminalLevel and set it to 1
        if (System.console() != null && System.getenv().get("TERM") != null) {
            Client.ansiColorSupported = true;
        }
        Client client1 = new Client();
        //Checking ANSI Color Supported

    }
}
