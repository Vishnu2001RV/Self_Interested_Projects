import asyncio
import subprocess
import websockets
import multiprocessing
from ctypes import c_bool, c_char
from multiprocessing import Manager
#import multiprocessing.sharedctypes as mpsc

cmd = "python -m http.server 8084 --directory ./obfuscated_files/"
pro = subprocess.Popen(cmd)


clients = set()

# This code has no effect on multiprocessing or multithreading
# as during that time seperate space is given for two different threds
# so look on to https://www.geeksforgeeks.org/multiprocessing-python-set-2/
#
# class exiting:
#     done = True
#     def get():
#         return exiting.done

exitcode = multiprocessing.Value(c_bool, True)


# persons = person_to_add
#persons = [mpsc.RawArray(c_char, 10) for _ in range(len(person_to_add))]




def main(exitcode, persons, password, direction, connected_user_logs):

    async def handler(websocket, path):

        global clients
        msg =""
        clients.add(websocket)
        try:
            msg = await websocket.recv()
            # print(msg)
            if msg in persons:
                await asyncio.wait([websocket.send("valid")])
                pass_check = await websocket.recv()
                connected_user_logs.append(msg)
                while exitcode.value:
                    await asyncio.sleep(2)
                
                if pass_check in password:     
                    await asyncio.wait([websocket.send(direction[0])])
                else:
                    await asyncio.wait([websocket.send("Password Error")])
                connected_user_logs.remove(msg) #

            else:
                await asyncio.wait([websocket.send("invalid")])

        except websockets.exceptions.ConnectionClosed:
            # Happens server is in option 1 state->client closed immediately after entering user name
            # Closed after just connected
            # So the server is not able to sent throgh the connection
            print("Client ("+ msg +") abruptly closed and was Partially Connected")

        finally:
            clients.remove(websocket)
            

    def exception_handler(loop, context):
        # multiple submit is also exception
        print("Unexcepted client closing")
        # print(str(context))
    try:
        
        new_loop = asyncio.new_event_loop()
        asyncio.gather(loop =new_loop, return_exceptions=False) # else print websocket exception from asyncio
        new_loop.set_exception_handler(exception_handler)

        start_server = websockets.serve(handler, port=6969, loop=new_loop)
        new_loop.run_until_complete(start_server)
        new_loop.run_forever()
    except Exception:
        print("caught")



if __name__ == '__main__':  # if not done in main asyncio creates subprocesses which are not
    # search  if __name__ == '__main__': why to use it in multiprocess

    # all the multiprocessing initialization should be done in __name__ =="main"
    # Else we get an error like: attempt to start new process before the existing process has been started

    # for shared list use Manager
    manager = Manager()
    person_to_add = ["Harry Potter", "Vishnu2001RV"]
    persons = manager.list(person_to_add)
    password = manager.list(["admin"])
    direction = manager.list(["./Lectures_CS161.html"])
    connected_user_logs = manager.list([])
    proc = multiprocessing.Process(target=main, args=(
        exitcode, persons, password, direction, connected_user_logs))  # args need to be tupil so put , also
    proc.start()

    logs = "Options:-\n 1. Send all client connected now\n 2. Pause all client connecting now\n 3. Add a User\n 4. Remove a User \n 5. Change Password \n 6. Change the Redirection\n 7. To print users still connected \n 8. Exit\n"
    print("Server Started")
    print(logs)

    while True:
        a = input()

        if (a == "1"):
            exitcode.value = False

        elif (a == "2"):
            exitcode.value = True
        elif(a == "3"):
            #persons.append(mpsc.Array(c_char, 1, lock=True))
            print("Enter User to be added")
            a = input()
            if a in persons:
                print("user exists")
            else:
                persons.append(a)

        elif(a == "4"):
            try:
                print("Enter User to be removed")
                user_to_remove = input()
                persons.remove(user_to_remove)

            except Exception:
                print("User Does Not Exist")
        elif(a == "5"):
            print("Enter Password")
            password[0] = input()

        elif(a == "6"):
            print("Enter the direction change")
            direction[0] = input()
        elif(a == "7"):
            print("Client Connected(If option 2 Server State is Enabled )\n")
            if len(connected_user_logs) != len(list(set(connected_user_logs))):
                print("Multiple Connection Detected\n")
            print(connected_user_logs)
            print("\nClick any key to continue")
            temp = input()
            

        if (a == "8"):
            proc.terminate()
            print("Terminated")
            exit(0)
        print()
        print(logs)
