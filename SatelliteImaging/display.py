import tkinter as tk
from tkinter import *
from tkinter.ttk import *
from tkinter.filedialog import askopenfile 
import numpy as np
from pandas import DataFrame
import matplotlib.pyplot as plt
from PIL import Image
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
import os
import requests
import json


local = True

OptionList = [
"resnet_vh",
"resnet_vv",
"unet_vh",
"unet_vv"
]

api_url_local = {"resnet_vh": "http://localhost:8601/v1/models/resnet_vh/versions/1:predict",
                 "resnet_vv": "http://localhost:8601/v1/models/resnet_vv/versions/1:predict",
                 "unet_vh": "http://localhost:8601/v1/models/unet_vh/versions/1:predict",
                 "unet_vv": "http://localhost:8601/v1/models/unet_vv/versions/1:predict"}

api_url_server = {"resnet_vh": "https://satellite-imaging.herokuapp.com/v1/models/resnet_vh/versions/1:predict",
                  "resnet_vv": "https://satellite-imaging.herokuapp.com/v1/models/resnet_vv/versions/1:predict",
                  "unet_vh": "https://satellite-imaging.herokuapp.com/v1/models/unet_vh/versions/1:predict",
                  "unet_vv": "https://satellite-imaging.herokuapp.com/v1/models/unet_vv/versions/1:predict"}

def prediction_response(model_name,img_arr):

    global api_url_local, api_url_server,labelTest1,CheckVar1
    img_arr1 = 2*((img_arr-np.min(img_arr)) /
                  (np.max(img_arr)-np.min(img_arr)))-1

    
    img_arr1 = np.expand_dims(img_arr1, 0)
    img_arr1 = np.expand_dims(img_arr1, 3)
    data = json.dumps({"signature_name": "serving_default",
                       "instances": img_arr1.tolist()})
    if CheckVar1.get():
        url = api_url_server[model_name]    
    else:
        url = api_url_local[model_name]

    response = requests.post(url, data=data, headers={
        "content_type": "application/json"})
    predictions = json.loads(response.text)
    prediction = np.array(predictions["predictions"])
    prediction = prediction.squeeze(0)
    prediction = prediction.squeeze(2)
    prediction = 2*((prediction-np.min(img_arr)) /(np.max(img_arr)-np.min(img_arr)))-1

    return prediction


file_path = ''


def open_file_sensor1():
    global file_path, ax2, bar2, img_arr2, img_arr3,ax3,bar3,variable
    file_path = askopenfile(mode='r', filetypes=[('Image Files', '*tif')])
    if file_path is not None:
        filename = os.path.basename(file_path.name)
        ax2.set_title('SENSOR 1('+filename+')')
        img = Image.open(file_path.name)
        img_arr2 = np.array(img)
        ax2.imshow(img_arr2, cmap="gray")
        bar2.draw()
        img_arr3 = prediction_response(variable.get(), img_arr2)
        ax3.imshow(img_arr3, cmap="gray")
        bar3.draw()


def open_file_sensor2():
    global file_path, ax1, bar1, img_arr1
    file_path = askopenfile(mode='r', filetypes=[('Image Files', '*tif')])
    if file_path is not None:
        filename = os.path.basename(file_path.name)
        ax1.set_title('SENSOR 2('+filename+')')
        img = Image.open(file_path.name)
        img_arr1 = np.array(img)
        ax1.imshow(img_arr1, cmap="gray")
        bar1.draw()

# img = Image.open('./ndvi.2.tif')
img_arr1 = np.full((256, 256), 254)

img_arr2 = np.full((256, 256), 254)

img_arr3 = np.full((256, 256), 120)

root= tk.Tk()
CheckVar1 = IntVar()
#---


variable = tk.StringVar(root)
variable.set(OptionList[0])


labelTest1 = tk.Label(text="Satellite Image Interpretation", font=('Helvetica bold', 16), fg='red')
labelTest1.pack(side="top",fill=tk.BOTH)

opt = tk.OptionMenu(root, variable, *OptionList)
opt.config(width=20, font=('Helvetica', 10))
opt["height"] = '1'
opt['width'] = '15'
opt["menu"]["activeborderwidth"] = 32
opt.pack(side=tk.LEFT)

C1 = Checkbutton(root, text="SERVER ON", variable=CheckVar1,
                 onvalue=1, offvalue=0,
                 width=10)
C1.pack(anchor="n", side="left")

sensor2file = Button(
    root,
    text='Choose Sensor  \n Image',
    command=lambda: open_file_sensor2(),

)
sensor2file.pack(side="left")

labelTest = tk.Label(text="", font=('Helvetica', 12), fg='red')
labelTest.pack(side="top",fill=tk.BOTH)

def callback(*args):
    global img_arr2,img_arr3, ax3, bar3,labelTest
    labelTest.configure(text="")
    img_arr3 = prediction_response(variable.get(), img_arr2)
    ax3.imshow(img_arr3, cmap="gray")
    bar3.draw()
    labelTest.configure(text="The selected model is {}".format(variable.get()))


variable.trace("w", callback)

#---
#root.geometry("1000x500" )




figure1 = plt.Figure(figsize=(3,4), dpi=100)
ax1 = figure1.add_subplot(111)
bar1 = FigureCanvasTkAgg(figure1, root)
bar1.get_tk_widget().pack(side=tk.LEFT, fill=tk.BOTH)
ax1.set_title('SENSOR 2')
ax1.imshow(img_arr1,cmap="gray")

sensor1file = Button(
    root, 
    text ='Choose Sensor 1 \n Image', 
    command=lambda: open_file_sensor1(),
    
    ) 
sensor1file.pack(side=tk.LEFT)

figure2 = plt.Figure(figsize=(3,4), dpi=100)
ax2 = figure2.add_subplot(111)
bar2 = FigureCanvasTkAgg(figure2, root)
bar2.get_tk_widget().pack(side=tk.LEFT, fill=tk.BOTH)
ax2.set_title('SENSOR 1')
ax2.imshow(img_arr2,cmap="gray")

figure3 = plt.Figure(figsize=(3,4), dpi=100)
ax3 = figure3.add_subplot(111)
bar3 = FigureCanvasTkAgg(figure3, root)
bar3.get_tk_widget().pack(side=tk.LEFT, fill=tk.BOTH)
#ax3.legend(['Stock_Index_Price']) 
#ax3.set_xlabel('Interest Rate')
ax3.set_title('Generated OUTPUT')
ax3.imshow(img_arr3,cmap="gray")

root.mainloop()
