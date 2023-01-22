SERVER:-

1. To Compile and generate database_util.g.dart
   ```bash
   dart run build_runner build
   ```

2. To Start the server do(In folder database_server)
   ```bash
   dart run --enable-vm-service
   ```
3. Reference at end of each file
4. Either create cluster from mongodb cloud and add the uri, password in env.json
   - OR Use mongodb locally. So that the server could access it using mongodb drivers.