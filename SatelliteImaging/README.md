<h1><center>SATELLITE IMAGING</center></h1>
<hr>

1. Tensorflow Models using TensorflowServering has been deployed on Heroku (Server Details are in **MainServer Folder**)
2. To run the GUI Use

   ```bash
   python display.py
   ```
3. For using the deployed version Click **SERVER ON** on GUI and **Choose Sensor1 Image** on **SENSOR 1**for uploadng the corresponding satellite **tif** image based on the model choosen on left side *(eg for **unet_vh** choose **vh.2.tif**  etc )*
4. **Choose Sensor Image** for **SENSOR2** is just for crossverifying with the **GENERATED OUTPUT**.

**For LocalHost:-**

1. Dont Choose **SERVER ON** option
2. Need to use **Docker**, which has models served using **TensorFlow Serving Container**  for local host connection with **GUI**.


<img src="./testSamples/GUIOUTPUT.png" alt="" border=3 height=300></img>
