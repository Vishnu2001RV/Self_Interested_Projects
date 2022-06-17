import java.io.*;
import java.net.*;
import java.awt.*;
import java.util.*;
import javax.swing.*;
import java.awt.event.*;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.concurrent.atomic.AtomicBoolean;



class ClientDisconnected extends Exception {
    public ClientDisconnected(String s) {
        // Call constructor of parent Exception
        super(s);
    }
}

class ServerDirectoryToClientUpdater extends Thread {

    DataOutputStream dos;
    String folderLocation = "./";
    final Object lock = new Object();
    String fileCollectionExisting = "";
    boolean connectedWithclient = true;
    AtomicBoolean statusBlockFlag = new AtomicBoolean(false);
    Logger logger = Logger.getLogger(ServerDirectoryToClientUpdater.class.getName());

    public ServerDirectoryToClientUpdater(DataOutputStream dos, String folderLocation) {
        this.dos = dos;
        this.folderLocation = folderLocation;
    }

    public void run() {
        try {

            Server.infolog("ServerDirectoryToClientUpdater Started...", logger);

            File[] files;
            int timmer = 10;
            String fileCollection = "";
            File currentDirectory = new File("./");

            // Best Practice to write the wait in Monitoring Thread
            while (true) {

                if (!connectedWithclient) {
                    connectedWithclient = false;
                    throw new ClientDisconnected("Disconnected With Client");

                }

                sleep(timmer);
                timmer = 1300;
                fileCollection = "";
                currentDirectory = new File(this.folderLocation);

                // Thread waits when server Directory is needed
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

                fileCollection=fileCollection.replaceAll(Server.class.getName() + ".java\n", "");

                if ((!fileCollectionExisting.equals(fileCollection)) || (!connectedWithclient)) {
                    // If change in file detected will intiminate the client
                    connectedWithclient = true;
                    fileCollectionExisting = fileCollection;
                    this.dos.writeUTF("ServerContinousFiles");
                    this.dos.flush();
                    this.dos.writeUTF(fileCollectionExisting);
                    this.dos.flush();

                }

            }
        } catch (IOException | InterruptedException | ClientDisconnected e) {
            // e.printStackTrace();
            Server.warninglog("Client Abruptly Terminated:- ServerDirectoryToClientUpdater ", logger);

        }
    }

}

class ClientFileStatusInServerStorage extends Thread {

    JTextArea serverFiles;
    final Object lock = new Object();
    static AtomicBoolean statusBlockFlag = new AtomicBoolean(true);
    Logger logger = Logger.getLogger(ClientFileStatusInServerStorage.class.getName());

    public Object getLock() {
        return this.lock;
    }

    public ClientFileStatusInServerStorage(JTextArea serverFiles) {

        this.serverFiles = serverFiles;

    }

    public void run() {
        try {

            Server.infolog("Client Status thread Running...",logger);

            File[] files;
            int timmer = 10;
            String location;
            Object temp = null;
            String fileCollection = "";
            File currentDirectory = new File("./");

            // need to arrange a map for client 1 to client 2
            // Best Practice to write the wait in Monitoring Thread
            while (true) {
                sleep(timmer);
                timmer = 1300;
                temp = Server.multipleClientChoice.getSelectedItem();
                if (temp != null) {
                    location = ClientHandler.clientVsDirectory.get(temp.toString());
                    if (location != null)
                        currentDirectory = new File(location);
                }
                // Thread waits when client files is needed
                if (ClientFileStatusInServerStorage.statusBlockFlag.get()) {
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
                fileCollection = fileCollection.replaceAll(Server.serverSourceFiles,"");
                fileCollection = fileCollection.replaceAll(Server.clientSourceFiles, "");
                serverFiles.setText(fileCollection);
                fileCollection = "";

            }

        } catch (Exception e) {
            // e.printStackTrace();
            Server.infolog("Exiting From the thread:- ClientFileStatusInServerStorage", logger);

        }
    }

}

// ClientHandler class
class ClientHandler extends Thread {
    // DateFormat fordate = new SimpleDateFormat("yyyy/MM/dd");
    // DateFormat fortime = new SimpleDateFormat("hh:mm:ss");

    String str;
    final Socket s;
    JTextField fileName;
    JTextArea serverFiles;
    String folderLocation;
    static int counter = 0;
    final DataInputStream dis;
    final DataOutputStream dos;
    static DataOutputStream[] mainDos;
    final String remoteSocketAddress;
    String connectedClientActualPath;
    static File clientFilesSeperator = new File("./");
    ServerDirectoryToClientUpdater serverContinousToClient;
    // Logger
    static Logger logger = Logger.getLogger(ClientHandler.class.getName());

    static LinkedHashMap<String, String> clientVsDirectory = new LinkedHashMap<String, String>();
    static LinkedHashMap<String, java.util.List<Object>> clientVsDataoutputstream = new LinkedHashMap<String, java.util.List<Object>>();
    static LinkedHashMap<java.util.List<String>, Integer> clientNumber = new LinkedHashMap<java.util.List<String>, Integer>();
    static LinkedHashMap<java.util.List<String>, Integer> clientFilter = new LinkedHashMap<java.util.List<String>, Integer>();
    static LinkedHashMap<Integer, String> clientcontinuous_GlobalStorage = new LinkedHashMap<Integer, String>();
    static LinkedHashMap<DataOutputStream, ServerDirectoryToClientUpdater> dosVsServerToClientUpdater = new LinkedHashMap<DataOutputStream, ServerDirectoryToClientUpdater>();
    static LinkedHashMap<DataOutputStream, AtomicBoolean> dosVsUploadStatus = new LinkedHashMap<DataOutputStream, AtomicBoolean>();

    // constructor
    public ClientHandler(Socket s, DataInputStream dis, DataOutputStream dos, JTextField fileName,
            JTextArea serverFiles) {
        this.s = s;
        this.remoteSocketAddress = this.s.getRemoteSocketAddress().toString().split(":")[0];
        this.dis = dis;
        this.dos = dos;
        this.serverFiles = serverFiles;
        this.fileName = fileName;
    }

    @Override
    public void run() {
        // key storing map b/w connected and existing assigned port no
        // using port being assined to another

        try {

            // any client connected we receive the actual path
            str = (String) dis.readUTF();
            this.connectedClientActualPath = str;
            java.util.List<String> temp = Arrays.asList(this.remoteSocketAddress, this.connectedClientActualPath);
            Integer clientNumberAllocated = ClientHandler.clientNumber.get(temp);

            if (clientNumberAllocated == null) {

                clientNumberAllocated = ++ClientHandler.counter;
                ClientHandler.clientNumber.put(temp, clientNumberAllocated);

            }

            dos.writeUTF(clientNumberAllocated + "");
            dos.flush();

            // ensuring server disconnected do not affect the client number
            str = dis.readUTF(); // gettig client assigned number

            Integer count = ClientHandler.clientFilter.get(temp);

            if (count != null) // not null 1 or 0 is case => increment count
                               // increment count if
            {
                count++;

                if (count > 1) // >1 count is 2 delete
                {

                    dos.writeUTF("Rejected");
                    dos.flush();
                    ClientHandler.clientFilter.put(temp, count);
                    throw new Exception("Rejected");

                } else // count still 1
                {
                    ClientHandler.clientFilter.put(temp, count);

                }

            } else // null 1 assign
            {
                count = 1;
                // 1st time connection
                ClientHandler.clientFilter.put(temp, count);

            }

            dos.writeUTF("Accepted"); // for rejected clients connected twice no need to change the activated
            dos.flush();

            this.folderLocation = "./" + Math.abs(this.connectedClientActualPath.hashCode()) + ""
                    + this.remoteSocketAddress.replaceAll("[^a-zA-Z0-9]", "") + "/";
            ClientHandler.clientFilesSeperator = new File(this.folderLocation);
            if (!ClientHandler.clientFilesSeperator.isDirectory()) {
                ClientHandler.clientFilesSeperator.mkdir();
            }
            ClientHandler.clientVsDataoutputstream.put(str, Arrays.asList(this.dos, this.folderLocation));
            ClientHandler.clientVsDirectory.put(clientNumberAllocated + "", this.folderLocation);

            Server.multipleClientChoice.setModel(new DefaultComboBoxModel<String>(
                    ClientHandler.clientVsDataoutputstream.keySet().toArray(new String[0])));

            this.serverContinousToClient = new ServerDirectoryToClientUpdater(this.dos, this.folderLocation);
            this.serverContinousToClient.start();

            ClientHandler.dosVsServerToClientUpdater.put(this.dos,serverContinousToClient);
            dosVsUploadStatus.put(this.dos,new AtomicBoolean(false));
            

            // dosVSFolderLocation.put(this.dos, this.folderLocation);

            // any read comes through this
            while (true) {

                // mainly after a connection has been established
                str = (String) dis.readUTF();
                System.out.println("Client:- " + str);

                if (str.equals("UploadingFileFrom_Client")) {
                    String filename = (String) dis.readUTF();

                    long filesize = dis.readLong();

                    File tempfile = new File(this.folderLocation + filename);

                    if (!tempfile.exists()) {
                        tempfile.createNewFile();
                    }

                    if (filesize == 0) {
                        str = (String) dis.readUTF();
                        Server.infolog(str, logger);
                    } else {
                        FileWriter writingFile = new FileWriter(tempfile);

                        Byte ch;
                        for (long i = 0; i < filesize; i++) {
                            ch = dis.readByte();
                            writingFile.write(ch);
                        }

                        writingFile.close();

                        str = (String) dis.readUTF();
                        Server.infolog(str, logger);
                    }

                }
                if (str.equals("ClientContinousFiles")) {
                    str = (String) dis.readUTF();
                    clientcontinuous_GlobalStorage.put(clientNumberAllocated, str);
                    if (Server.serverClientChoice.getSelectedItem().equals("Client")) {
                        this.serverFiles.setText(str);
                    }
                }
                if (str.equals("clientRequest-Downloadfile")) {
                    str = (String) dis.readUTF();
                    File tempClient = new File(this.folderLocation + str);
                    if (tempClient.isFile()) {
                        // do upload
                        Server.onUpload(clientNumberAllocated, str);
                    } else {
                        dos.writeUTF("clientRequest-DownloadfileError");
                        dos.flush();
                        dos.writeUTF("File Not Present");
                        dos.flush();
                    }

                }
                if (str.equals("ServerRequest-DownloadfileError")) {
                    str = (String) dis.readUTF();
                    Server.warninglog(str, logger);

                }

            }

        } catch (Exception e) {
            // dis.close();
            // dos.close();
            Integer count = ClientHandler.clientFilter
                    .get(Arrays.asList(this.remoteSocketAddress, this.connectedClientActualPath));
            ClientHandler.clientFilter.put(Arrays.asList(this.remoteSocketAddress, this.connectedClientActualPath),
                    count - 1);

        }
    }
}

public class Server {

    ServerSocket ss;
    Socket s;
    DataInputStream dis;
    DataOutputStream dos;

    JTextArea serverFiles;
    JTextField fileName;
    static String options[] = { "Server", "Client" };
    public static final String ANSI_RED = "\u001B[31m";
    public static final String ANSI_BLUE = "\u001B[34m";
    public static final String ANSI_RESET = "\u001B[0m";
    static Boolean ansiColorSupported=false;
    static Logger logger = Logger.getLogger(Server.class.getName());
    static JComboBox<String> serverClientChoice = new JComboBox<String>(options);
    static JComboBox<String> multipleClientChoice = new JComboBox<String>();
    static String serverSourceFiles = "Server.java\n|Server.class\n|Server.[0-9]*.class\n|ServerDirectoryToClientUpdater.class\n|ServerDisconnected.class\n|ClientFileStatusInServerStorage.class\n|ClientHandler.class\n";
    static String clientSourceFiles = "Client.java\n|Client.class\n|Client.[0-9]*.class\n|ClientDirectoryToServerUpdater.class\n|ClientDisconnected.class\n|ClientFileStatusInClientStorage.class\n";

    static void infolog(String s, Logger logger) {
        if (!Server.ansiColorSupported) {
            logger.log(Level.INFO, s);
        } else {
            logger.log(Level.INFO, (ANSI_BLUE + s + ANSI_RESET));
        }

    }

    static void warninglog(String s, Logger logger) {
        if (!Server.ansiColorSupported) {
            logger.log(Level.INFO, s);
        } else {
            logger.log(Level.INFO, (ANSI_RED + s + ANSI_RESET));
        }
    }

    void server_start() {
        try {
            ss = new ServerSocket(6666);
            while (true) {

                s = null;
                s = ss.accept();
                Server.infolog("Connection Established with a client", logger);
                dos = new DataOutputStream(s.getOutputStream());
                dis = new DataInputStream(s.getInputStream());
                Thread t = new ClientHandler(s, dis, dos, fileName, serverFiles);
                t.start();

            }

        } catch (Exception e) {
            try {

                ss.close();
                // System.out.println("Client Abruptly Terminated");
                Server.infolog("Restarting Server", logger);
                server_start();
            } catch (Exception e1) {
                Server.warninglog("out", logger);
            }
        }

    }

    static void resume(ServerDirectoryToClientUpdater serverToClient) {
        try {
            serverToClient.statusBlockFlag.set(false);
            synchronized (serverToClient.lock) {
                serverToClient.lock.notify();
            }

        } catch (Exception e) {

        }
    }
    static void onUpload(Object temp, String fileNameText) {

        String serverSourceFilesTemp = Server.serverSourceFiles.replaceAll("\n", "");
        String clientSourceFilesTemp = Server.clientSourceFiles.replaceAll("\n", "");

        ServerDirectoryToClientUpdater serverToClient = null;
        DataOutputStream dos1 =null;

        try {

            if (fileNameText != null && temp != null && !fileNameText.equals("")) {

                
                java.util.List<Object> list = ClientHandler.clientVsDataoutputstream.get(temp.toString());
                dos1 = (DataOutputStream) list.get(0);
                String fileLocation = list.get(1).toString();
                File tempfile = new File(fileLocation + fileNameText);
                

                if (tempfile.isFile()&& !(fileNameText.matches(serverSourceFilesTemp)||fileNameText.matches(clientSourceFilesTemp))&&!ClientHandler.dosVsUploadStatus.get(dos1).get()) {

                    ClientHandler.dosVsUploadStatus.get(dos1).set(true); //to ensure 1 upload for respective client
                    serverToClient = ClientHandler.dosVsServerToClientUpdater.get(dos1);
                    //blocking client files in server status while uploading
                    serverToClient.statusBlockFlag.set(true);
                    dos1.writeUTF("UploadingFileFrom_Server");
                    dos1.flush();
                    dos1.writeUTF(fileNameText);
                    dos1.flush();

                    long length = (long) tempfile.length();

                    dos1.writeLong(length);
                    dos1.flush();

                    if (length == 0) {
                        dos1.writeUTF("SERVER :- Finished Sending");
                        dos1.flush();
                        Server.resume(serverToClient);
                        //needs to Resume Here

                    } else {

                        int ch;
                        FileReader ServerFileReader = new FileReader(tempfile);
                        while ((ch = ServerFileReader.read()) != -1) {
                            dos1.write((char) ch);
                        }
                        dos1.flush();
                        ServerFileReader.close();
                        dos1.writeUTF("SERVER :- Finished Sending");
                        dos1.flush();
                        Server.resume(serverToClient);
                        //needs to Resume Here

                    }
                    ClientHandler.dosVsUploadStatus.get(dos1).set(false);//Respective Client Upload Finished
                } 
                else {
                    Server.warninglog("Cannot Upload:- File Does Not Exist", logger);
                }
            } 
            else {
                Server.warninglog("Cannot Upload", logger);
            }
        } 
        catch (Exception e) {
            // e.printStackTrace();

            
            if (serverToClient != null) {
                Server.resume(serverToClient);
            }
            if (dos1 != null) {
                ClientHandler.dosVsUploadStatus.get(dos1).set(false);// Respective Client Upload Finished
            }
            Server.warninglog("Cannot Submit", logger);
        }

    }

    void onDownload() {

        // on download flag set as true
        // then client initiate upload request
        // sending filename and file
        Object temp = Server.multipleClientChoice.getSelectedItem();
        String fileNameText = fileName.getText();
        try {

            if (temp != null && fileNameText != null && !fileNameText.equals("")) {
                java.util.List<Object> list = ClientHandler.clientVsDataoutputstream.get(temp.toString());
                DataOutputStream dos1 = (DataOutputStream) list.get(0);
                dos1.writeUTF("ServerRequest-Downloadfile");
                dos1.flush();
                dos1.writeUTF(fileNameText);
                dos1.flush();

            } else {
                Server.warninglog("Could Not Download", logger);
            }

        } catch (Exception e) {
            Server.warninglog("Could Not Download", logger);
        }

    }

    public Server() {
        JFrame jf = new JFrame("SERVER");
        jf.setLayout(null);

        fileName = new JTextField();
        serverFiles = new JTextArea();
        

        // Starting ClientFileStatusInServerStorage thread from server
        ClientFileStatusInServerStorage status1 = new ClientFileStatusInServerStorage(this.serverFiles);
        status1.start();

        JButton ju = new JButton("Upload");
        JButton jd = new JButton("Download");
        Insets insets = jf.getInsets();

        JLabel title = new JLabel("TCP SERVER");
        title.setFont(new Font("Arial", Font.BOLD, 50));
        title.setBounds(260 + insets.left, 40 + insets.right, 800, 50);
        title.setForeground(Color.BLACK);

        JLabel title1 = new JLabel("Files in the Server Directory:");
        title1.setFont(new Font("Arial", Font.BOLD, 16));
        title1.setBounds(235 + insets.left, 110 + insets.right, 400, 50);

        Server.serverClientChoice.setFont(new Font("Arial", Font.PLAIN, 18));
        Server.serverClientChoice.setBounds(590 + insets.left, 120 + insets.right, 100, 30);
        Server.serverClientChoice.setForeground(Color.BLACK);

        Server.serverClientChoice.addActionListener(new ActionListener() {
            
            public void actionPerformed(ActionEvent e) {

                if (Server.serverClientChoice.getSelectedItem().equals("Server")) {

                    // server is selected then need to Resume ClientFileStatusInServerStorage to
                    // fetch
                    // client content in serverStorage

                    ClientFileStatusInServerStorage.statusBlockFlag.set(false);
                    synchronized (status1.lock) {
                        status1.lock.notify();
                    }
                    title1.setText("Client Files in the current "
                            + Server.serverClientChoice.getSelectedItem().toString() + " Directory:");

                } else {

                    // Need to Pause ClientFileStatusInServerStorage as we are fetching directly
                    // from
                    // client
                    status1.statusBlockFlag.set(true);

                    Object temp = Server.multipleClientChoice.getSelectedItem();

                    if (temp != null) {
                        String result = ClientHandler.clientcontinuous_GlobalStorage
                                .get(Integer.parseInt(temp.toString()));
                        serverFiles.setText(result);

                        
                    } else {
                        serverFiles.setText(" ");
                    }
                    
                    title1.setText("Files Present in the Remote "
                            + Server.serverClientChoice.getSelectedItem().toString() + " Directory:");
                }

                serverFiles.setCaretPosition(0);


                

            }
            
        });
        Server.serverClientChoice.setSelectedItem("Server");

        Server.multipleClientChoice.setFont(new Font("Arial", Font.PLAIN, 18));
        Server.multipleClientChoice.setBounds(690 + insets.left, 120 + insets.right, 100, 30);
        Server.multipleClientChoice.setForeground(Color.BLACK);
        // Using Lambda Function
        Server.multipleClientChoice.addActionListener(e -> {

            if (Server.serverClientChoice.getSelectedItem().toString().equals("Client")) {
                
                Object temp = Server.multipleClientChoice.getSelectedItem();
                if(temp!=null){
                    Integer result = Integer.parseInt(temp.toString());
                    serverFiles.setText(ClientHandler.clientcontinuous_GlobalStorage.get(result));
                }
                title1.setText("Files Present in the Remote " + Server.serverClientChoice.getSelectedItem().toString()
                        + " Directory:");
            }
            else{

                title1.setText("Client Content in the current " + Server.serverClientChoice.getSelectedItem().toString()
                        + " Directory:");
            }
            serverFiles.setCaretPosition(0);
            

        });

        serverFiles.setFont(new Font("Arial", Font.PLAIN, 18));
        serverFiles.setLineWrap(true);
        serverFiles.setEditable(false);
        
        JScrollPane serverFilesScroll = new JScrollPane(serverFiles);
        serverFilesScroll.setSize(400, 216);
        serverFilesScroll.setLocation(240 + insets.left, 180 + insets.right);
        serverFilesScroll.getVerticalScrollBar().setValue(0);

        JLabel fileNameText = new JLabel("Enter File Name:");
        fileNameText.setFont(new Font("Arial", Font.PLAIN, 18));
        fileNameText.setBounds(90 + insets.left, 440 + insets.right, 800, 50);

        fileName.setSize(480, 50);
        fileName.setFont(new Font("Arial", Font.PLAIN, 18));
        fileName.setLocation(350 + insets.left, 440 + insets.right);

        ju.setSize(200, 50);
        ju.setFont(new Font("Arial", Font.PLAIN, 18));
        ju.setLocation(190 + insets.left, 540 + insets.right);
        // using Lambda Expression
        ju.addActionListener(e -> {

            Object temp = Server.multipleClientChoice.getSelectedItem();
            String fileNameTextUpload = fileName.getText();
            Server.onUpload(temp, fileNameTextUpload);

        });

        jd.setSize(200, 50);
        jd.setFont(new Font("Arial", Font.PLAIN, 18));
        jd.setLocation(490 + insets.left, 540 + insets.right);
        jd.addActionListener(e -> {

            onDownload();

        });

        jf.add(title);
        jf.add(title1);
        jf.add(Server.serverClientChoice);
        jf.add(Server.multipleClientChoice);
        jf.add(serverFilesScroll);
        jf.add(ju);
        jf.add(jd);
        jf.add(fileName);
        jf.add(fileNameText);
        jf.setSize(900, 700);
        jf.setLocation(100, 100);
        jf.setVisible(true);
        jf.setDefaultCloseOperation(3);

        // starting server
        server_start();
    }

    public static void main(String[] args) {

        // If ANSI Color to support on windows setup EnvironmentalVariable "TERM" to SET
        // And in registry [HKEY_CURRENT_USER\Console]
        // and Add new dword VirtualTerminalLevel and set it to 1
        if (System.console() != null && System.getenv().get("TERM") != null) {
            Server.ansiColorSupported = true;
        }
        Server server1 = new Server();

    }
}
