[Skip to content](#content)

[![](https://i1.wp.com/py2py.com/wp-content/uploads/2019/01/cropped-logo-trans.png?fit=587%2C143&ssl=1)](https://py2py.com/ "Py2py")

-   [Home](https://py2py.com)
-   Search for:

[![](https://i1.wp.com/py2py.com/wp-content/uploads/2019/01/cropped-logo-trans.png?fit=587%2C143&ssl=1)](https://py2py.com/ "Py2py")

Toggle Navigation

Toggle Navigation

-   [Home](https://py2py.com)
-   Search for:

Bokeh Effect in Image using Python {.title .entry-title}
==================================

-   [OpenCV](https://py2py.com/category/opencv/)

![](https://i0.wp.com/py2py.com/wp-content/uploads/2019/01/Screenshot-2019-01-30-at-2.14.43-PM.png?resize=603%2C414&ssl=1)

Bokeh is the Japanese word which means Blur. Bokeh tends to the region
which we choose to out of focus. This effect makes the in-focus image so
vibrant and clear to eyes which makes the photo looks more elegant. Now
a days, This can be achieved easily with the help of DSLRs at the time
of capturing but If we wish to achieve this later then we need to use
photoshops or other photo editing software.

but Today I would like to share how to achieve Bokeh effect in Python.

Lets look at some samples. and then we proceed towards the code.

### Sample

-   ![](https://i1.wp.com/py2py.com/wp-content/uploads/2019/01/Screenshot-2019-01-30-at-4.30.23-AM-1.png?w=750&ssl=1)
    ![](https://i1.wp.com/py2py.com/wp-content/uploads/2019/01/Screenshot-2019-01-30-at-4.30.23-AM-1.png?w=750&ssl=1)
    Before\
-   ![](https://i1.wp.com/py2py.com/wp-content/uploads/2019/01/Screenshot-2019-01-30-at-4.30.02-AM-1.png?w=750&ssl=1)
    ![](https://i1.wp.com/py2py.com/wp-content/uploads/2019/01/Screenshot-2019-01-30-at-4.30.02-AM-1.png?w=750&ssl=1)
    After\

-   ![](https://i2.wp.com/py2py.com/wp-content/uploads/2019/01/Screenshot-2019-01-30-at-4.29.03-AM.png?w=750&ssl=1)
    ![](https://i2.wp.com/py2py.com/wp-content/uploads/2019/01/Screenshot-2019-01-30-at-4.29.03-AM.png?w=750&ssl=1)
    Before
-   ![](https://i1.wp.com/py2py.com/wp-content/uploads/2019/01/Screenshot-2019-01-30-at-4.29.25-AM.png?w=750&ssl=1)
    ![](https://i1.wp.com/py2py.com/wp-content/uploads/2019/01/Screenshot-2019-01-30-at-4.29.25-AM.png?w=750&ssl=1)
    After

### Pre-Requisite

In this project, we will use the HSV model and a tracker for the HSV
model so before proceeding further I would suggest you read these 2
articles.

-   [We already have RGB so why we need HSV
    ?](https://py2py.com/we-already-have-rgb-so-why-we-need-hsv/)

-   [Tracker for HSV model: Overview and
    Explanation](https://py2py.com/tracker-for-hsv-model-overview-and-explanation/)

### Code

Okay so let’s get started, This is a very interesting project and it
will teach you a lot of new things, I will try to explain each and
everything in details and even if you face any doubt then comment
section is always open.

The basic idea behind this project is to crop the image which we want to
focus and at the same time make whole image blur then do some analysis
and contour work on the cropped image to etch out the portion which we
want to focus, and paste it on the blurred image.

> **As always, I am adding the full code here if you want to understand
> the specific function or specific line then just navigate to the
> particular line in the explanation**

``` {.brush: .python; .title: .; .notranslate title=""}
import cv2
import numpy as np
import Tracker_HSV as tr
from PIL import Image
import os

cv2.namedWindow('mask',cv2.WINDOW_NORMAL)
cv2.resizeWindow('mask',(500,500))
filename= 'flower.jpg'
cwd = os.getcwd()
name_file=os.path.splitext(filename)[0]

path_save_temp=os.path.join(cwd,'Data')
path_save_folder=os.path.join(path_save_temp,f'{name_file}_blur_data')
if not os.path.exists(path_save_folder):
    os.makedirs(path_save_folder)


img=cv2.imread(filename)
img = cv2.GaussianBlur(img,(5,5),0)
img_hsv=cv2.cvtColor(img,cv2.COLOR_BGR2HSV)

file_save_blur= os.path.join(path_save_folder,'blur.png')
im_blur = cv2.GaussianBlur(img,(81,81),0)
cv2.imwrite(file_save_blur,im_blur)

xs,ys,w,h = cv2.selectROI('mask',img)
crop_img=crop_img_true=crop_img_contour=img[ys:ys+h, xs:xs+w]

if not crop_img_true.shape[0]> 1:
    crop_img_true=img

x,y,z,a,b,c=(tr.tracker(crop_img_true))

crop_img_true=cv2.cvtColor(crop_img_true,cv2.COLOR_BGR2HSV)

file_save_mask_inrange= os.path.join(path_save_folder,'mask inRange.png')
mask_inRange=cv2.inRange(crop_img_true,(x,y,z),(a,b,c))
cv2.imwrite(file_save_mask_inrange,mask_inRange)


_, threshold = cv2.threshold(mask_inRange, 250, 255, cv2.THRESH_BINARY)
Gauss_threshold =cv2.adaptiveThreshold(threshold,255,cv2.ADAPTIVE_THRESH_GAUSSIAN_C,cv2.THRESH_BINARY_INV,101,10)


blank_space_black= np.zeros((crop_img_true.shape[0],crop_img_true.shape[1]),np.uint8)
blank_space_black[:]=(0)

_,contours,_ = cv2.findContours(Gauss_threshold, cv2.RETR_TREE, cv2.CHAIN_APPROX_NONE)


maxi=cv2.contourArea(contours[0])
c=[]

for cnt in contours:
    if cv2.contourArea(cnt)>=maxi:
        maxi=cv2.contourArea(cnt)
##        print(cv2.contourArea(cnt))
        c= cnt

file_save_contour= os.path.join(path_save_folder,'Contour.png')
cv2.drawContours(crop_img_contour, c, -1, (0, 255, 0), 5)
cv2.imwrite(file_save_contour,crop_img_contour)


file_save_poly= os.path.join(path_save_folder,'mask fill poly.png')
mask_poly=cv2.fillConvexPoly(blank_space_black,c,(255,255,255))
cv2.imwrite(file_save_poly,mask_poly)

crop_img_true=cv2.cvtColor(crop_img_true,cv2.COLOR_HSV2BGR)

file_save_mask_bitwise= os.path.join(path_save_folder,'mask bitwise and.png')
mask_bitwise_and = cv2.bitwise_and(crop_img_true,crop_img_true,mask=mask_poly)
cv2.imwrite(file_save_mask_bitwise,mask_bitwise_and)

im2= Image.open(file_save_mask_bitwise)
im2=im2.convert('RGBA')

datas=im2.getdata()
newdata=[]

for data in datas:
    if data[0]== 0 and data[1]== 0 and data[2]== 0:
        newdata.append((255,255,255,0))
    else:
        newdata.append(data)

file_save_transparent= os.path.join(path_save_folder,'transparent.png')
im2.putdata(newdata)
im2.save(file_save_transparent)

im_blur= Image.open(file_save_blur)

file_save_final= os.path.join(path_save_folder,'final.png')
im_blur.paste(im2,(xs,ys),im2)
im_blur.save(file_save_final)

im_final= Image.open(file_save_final)
im_final.show('Final Result')
cv2.waitKey(0)
cv2.destroyAllWindows()  
```

* * * * *

First of all we are importing the necessary packages

``` {.brush: .python; .title: .; .notranslate title=""}
import cv2
import numpy as np
import Tracker_HSV as tr
from PIL import Image
import os
```

Normally the images open in their own window and sometime when
resolution of image are too high then it wont fit in the screen. So to
resolve this problem we made our own window and open the image in this
window.

Next we specify the filename variable at the top for easy access, and
getting the path of current working directory which we will use to make
folders and store the data neat and clean.

There is a function os.path.splittext(), actually as the same suggest it
is used to split the paths. here we are using it to extract the name of
the file. Suppose the file name is flower.jpg then
os.path.splitext(filename)[0] will be ‘flower’ and
os.path.splitext(filename)[1] will be ‘jpg’

``` {.brush: .plain; .first-line: .7; .title: .; .notranslate title=""}
cv2.namedWindow('mask',cv2.WINDOW_NORMAL)
cv2.resizeWindow('mask',(500,500))
filename= 'flower.jpg'
cwd = os.getcwd()
name_file=os.path.splitext(filename)[0]
```

Now our plan is to make a folder named ‘Data’ where we store the data of
every image we use. Such that we can maintain the data easily. In the
‘Data’ folder a sub folder will be made at the time of execution with
the name of name\_file+blur\_analysis. in this folder we will save all
the images we get in one session.

``` {.brush: .python; .first-line: .13; .title: .; .notranslate title=""}
path_save_temp=os.path.join(cwd,'Data')
path_save_folder=os.path.join(path_save_temp,f'{name_file}_blur_data')
if not os.path.exists(path_save_folder):
    os.makedirs(path_save_folder)
```

Here we are opening the file and saving it into a variable ‘img’. Here
one line is commented, This is the Gaussian Blur function as the name
suggest it blur the image. Here we used it to smooth the image a bit.
Here (5,5) is the kernal width and height, and note that it is always a
odd number.

Next, we convert the color model to HSV because it is best suited for
color detection in an image. In the later step, we apply Gaussian blur
on the image and save it in another variable. named ‘im\_blur’. finally
we save the file in the specific folder.

``` {.brush: .plain; .first-line: .23; .title: .; .notranslate title=""}
file_save_blur= os.path.join(path_save_folder,'blur.png')
im_blur = cv2.GaussianBlur(img,(81,81),0)
cv2.imwrite(file_save_blur,im_blur)
```

In this step we use cv2.selectROI() function. This function is very
useful and has n number of application. This allow us to select a Region
of Interest using mouse directly on the image, We are using this to crop
a rectangular portion in which our focus is lying.

It returns the top left corner points and width & height of the cropped
image. It looks like this. once you selected the desired portion just
hit enter to crop it.

![](https://i1.wp.com/py2py.com/wp-content/uploads/2019/01/Screenshot-2019-01-30-at-5.36.33-AM.png?w=750&ssl=1)

![](https://i1.wp.com/py2py.com/wp-content/uploads/2019/01/Screenshot-2019-01-30-at-5.36.33-AM.png?w=750&ssl=1)

ROI

and then we save this crop image variable in bunch of other variable.

``` {.brush: .plain; .title: .; .notranslate title=""}
xs,ys,w,h = cv2.selectROI('mask',img)
crop_img=crop_img_true=crop_img_contour=img[ys:ys+h, xs:xs+w]
```

If a user doesn’t want to crop the image then, he may either close the
window or press escape to exit, in both ways ‘crop\_img’ variable left
empty, and in this step we are checking the same if this variable has
any shape or not, if not then we copy original image variable to this
crop image variable, but if the variable is found then it will proceed
as its own variable.

``` {.brush: .python; .first-line: .30; .title: .; .notranslate title=""}
if not crop_img_true.shape[0]> 1:
    crop_img_true=img
```

Here we use tracker function to find the lower and upper values which we
will use to find the initial mask For more info on this Tracker\_HSV
function please visit
[Tracker\_HSV](https://py2py.com/tracker-for-hsv-model-overview-and-explanation/)
in which I explain the full program.

In the next step we convert crop\_image to HSV model, and apply inRange
funtion to mask out the desired image, at this stage there is lots of
noise and other contours in the image, but dont worry, we will clear it
out in later steps.

At this point our mask looks like this.

![](https://i1.wp.com/py2py.com/wp-content/uploads/2019/01/mask-inRange.png?w=750&ssl=1)

![](https://i1.wp.com/py2py.com/wp-content/uploads/2019/01/mask-inRange.png?w=750&ssl=1)

mask inRange

``` {.brush: .plain; .first-line: .33; .title: .; .notranslate title=""}
x,y,z,a,b,c=(tr.tracker(crop_img_true))

crop_img_true=cv2.cvtColor(crop_img_true,cv2.COLOR_BGR2HSV)

file_save_mask_inrange= os.path.join(path_save_folder,'mask inRange.png')
mask_inRange=cv2.inRange(crop_img_true,(x,y,z),(a,b,c))
cv2.imwrite(file_save_mask_inrange,mask_inRange)
```

Here we use thresholding the image followed by the Gaussian adaptive
threshold, The reason of this is to remove the noise and get a smooth
looking image on which we can apply contour.

Apart from Adaptive Gaussian threshold, there is also an Adaptive Mean
threshold but it’s not as good as Adaptive Gaussian threshold to remove
the noise in an image. Here is an example

![](https://i2.wp.com/py2py.com/wp-content/uploads/2019/01/ada_threshold.jpg?w=750&ssl=1)

![](https://i2.wp.com/py2py.com/wp-content/uploads/2019/01/ada_threshold.jpg?w=750&ssl=1)

Here you can see Adaptive Gaussian Thresholding is quite good in the
matter of removing the noise, The image source is [OpenCV: Image
Thresholding](https://docs.opencv.org/3.4/d7/d4d/tutorial_py_thresholding.html).
OpenCV documentation are pretty good and well enough to teach OpenCV on
its own.

``` {.brush: .plain; .first-line: .42; .title: .; .notranslate title=""}
_, threshold = cv2.threshold(mask_inRange, 250, 255, cv2.THRESH_BINARY)
Gauss_threshold =cv2.adaptiveThreshold(threshold,255,cv2.ADAPTIVE_THRESH_GAUSSIAN_C,cv2.THRESH_BINARY_INV,101,10)
```

Now we are creating a black canvas with the same size of corp image.
Here we use a numpy array, it will create an array of matrix of Width
and Height of crop Image. We use a datatype uint8, This datatype value
range from 0-255 and we use it normally when we have to specify any
color matrix of array in python.

In the next step, we specify the color of that matrix, Here the function
work as follows blank\_space\_black[height: width] since we need to
color code full image so we use blank\_space\_black[:], We can assign a
different color to a different portion. For example:

``` {.brush: .python; .title: .; .notranslate title=""}
##Creating Blank Space

import numpy as np
import cv2

height=300
width=300
canvas= np.zeros((width,height,3),np.uint8)


####### Black Canvas
##canvas[:]=(0)
##
##cv2.imshow('black', canvas)
##cv2.imwrite('black.png',canvas)


##### Red and Green Canvas
canvas[0:height//2 : ]=[(0,255,0)]
canvas[height//2:height : ]=[(0,0,255)]
cv2.imshow('Red &amp; Green', canvas)
cv2.imwrite('Red &amp; Green.png',canvas)

cv2.waitKey(0)
cv2.destroyAllWindows()
```

-   ![](https://i2.wp.com/py2py.com/wp-content/uploads/2019/01/black.png?w=750&ssl=1)
    ![](https://i2.wp.com/py2py.com/wp-content/uploads/2019/01/black.png?w=750&ssl=1)
    SoBlack Canvas
-   ![](https://i2.wp.com/py2py.com/wp-content/uploads/2019/01/Red-Green.png?w=750&ssl=1)
    ![](https://i2.wp.com/py2py.com/wp-content/uploads/2019/01/Red-Green.png?w=750&ssl=1)
    Red and Green Canvas\

So , in the same way we can create a blank canvas according to the
requirement.

``` {.brush: .python; .first-line: .46; .title: .; .notranslate title=""}
blank_space_black= np.zeros((crop_img_true.shape[0],crop_img_true.shape[1]),np.uint8)
blank_space_black[:]=(0)
```

Here we are finding the possible ***contours*** in an image,
cv2.CHAIN\_APPROX\_NONE means it will store all the coordinates if it
was cv2.CHAIN\_APPROX\_SIMPLE then it will store only corner
coordinates. Here we pass that image on which we applied adaptive
gaussian threshold.

``` {.brush: .python; .first-line: .49; .title: .; .notranslate title=""}
_,contours,_ = cv2.findContours(Gauss_threshold, cv2.RETR_TREE, cv2.CHAIN_APPROX_NONE)
```

In this step we are defining a variable *maxi* in which Area formed by
the first contour is stored, a contour is an array which contains all
the point of a closed curve, it can be of any shape and of any size. and
in the next step, we are defining a list in which we will store the
contour array of that contour whose area is the biggest.

``` {.brush: .python; .first-line: .52; .title: .; .notranslate title=""}
maxi=cv2.contourArea(contours[0])
c=[]
```

Here we are Iterating all the contours and finding the maximum contour
which forms a max area. when the max area is found then an array of
contour get stored in a list c, which we will use to form a mask.

``` {.brush: .python; .first-line: .55; .title: .; .notranslate title=""}
for cnt in contours:
    if cv2.contourArea(cnt)>=maxi:
        maxi=cv2.contourArea(cnt)
##        print(cv2.contourArea(cnt))
        c= cnt
```

Drawing a contour on an image is just for the understanding that where
the contour is found in an image. In the first line, we store the path
variable where the image to be saved then we draw the contour using
cv2.drawContour() function,

its attributes are cv2.drawContour(image\_name, contour array,
contoured, color, width) here every attribute is self-explanatory
except, contourIdx, it is a parameter which is used to draw the specific
contour or points, if it’s negative then all the contours are drawn.

in the next step we are saving this image. The image will look like
this.

![](https://i0.wp.com/py2py.com/wp-content/uploads/2019/01/Contour.png?w=750&ssl=1)

![](https://i0.wp.com/py2py.com/wp-content/uploads/2019/01/Contour.png?w=750&ssl=1)

Contour on an image

``` {.brush: .python; .first-line: .61; .title: .; .notranslate title=""}
file_save_contour= os.path.join(path_save_folder,'Contour.png')
cv2.drawContours(crop_img_contour, c, -1, (0, 255, 0), 5)
cv2.imwrite(file_save_contour,crop_img_contour)
```

Here we are using the cv2.fillConvexPoly to fill the polygon made by
contour, this polygon is our foreground data which we selected in the
above image,

attributes of cv2.fillConvexPoly are: cv2.fillConvexPoly(canvas,
contour, color), canvas is any image on which we want to draw and fill
the contour polygon, once its made, we can save it to our data folder.

``` {.brush: .python; .first-line: .66; .title: .; .notranslate title=""}
file_save_poly= os.path.join(path_save_folder,'mask fill poly.png')
mask_poly=cv2.fillConvexPoly(blank_space_black,c,(255,255,255))
cv2.imwrite(file_save_poly,mask_poly)
```

Now we are converting our crop image to BGR again, which we will use in
next step.

``` {.brush: .plain; .first-line: .70; .title: .; .notranslate title=""}
crop_img_true=cv2.cvtColor(crop_img_true,cv2.COLOR_HSV2BGR)
```

In this step we are using cv2.bitwise\_and() function, it works like
wherever there is a white portion in the mask, it will just allow the
image to pass, but when there is a black portion it will block the image
to pass through. with this operation we get an image like this.

![](https://i1.wp.com/py2py.com/wp-content/uploads/2019/01/Image.png?w=750&ssl=1)

![](https://i1.wp.com/py2py.com/wp-content/uploads/2019/01/Image.png?w=750&ssl=1)

Mask using bitwise\_and()

``` {.brush: .python; .first-line: .72; .title: .; .notranslate title=""}
file_save_mask_bitwise= os.path.join(path_save_folder,'mask bitwise and.png')
mask_bitwise_and = cv2.bitwise_and(crop_img_true,crop_img_true,mask=mask_poly)
cv2.imwrite(file_save_mask_bitwise,mask_bitwise_and)
```

Now we are opening the mask image that we just saved, and our approach
is to convert this bitwise\_and mask a transparent one just by removing
black background,

For this, first we convert the image to RGBA format, here RGBA stands
for Red Green Blue and Alpha, alpha denotes the opacity on that
particular pixel if it’s zero then it will become transparent.

``` {.brush: .python; .first-line: .76; .title: .; .notranslate title=""}
im2= Image.open(file_save_mask_bitwise)
im2=im2.convert('RGBA')
```

Here we are parsing the image data and saving it in a variable *datas*,
We also defining another list, *newdata* in which we store RGBA data.

``` {.brush: .python; .first-line: .79; .title: .; .notranslate title=""}
datas=im2.getdata()
newdata=[]
```

In this step, we are checking each and every pixel if R=G=B equals 0
means if it’s a black color if so then we append the data as a white
image but alpha become zero means that pixel will become transparent,
but if it’s not black then data will append as it is.

Now we put data in an image, so the background will become transparent
and then we save it. We get the image something like this.

![](https://i2.wp.com/py2py.com/wp-content/uploads/2019/01/TransparentImage1.png?w=750&ssl=1)

![](https://i2.wp.com/py2py.com/wp-content/uploads/2019/01/TransparentImage1.png?w=750&ssl=1)

Transparent Image

``` {.brush: .plain; .first-line: .82; .title: .; .notranslate title=""}
for data in datas:
    if data[0]== 0 and data[1]== 0 and data[2]== 0:
        newdata.append((255,255,255,0))
    else:
        newdata.append(data)

file_save_transparent= os.path.join(path_save_folder,'transparent.png')
im2.putdata(newdata)
im2.save(file_save_transparent)
```

Now we have the transparent image, all we have to do is just paste the
image on blur version of the original image which will give the feeling
of ***Bokeh effect.* **For this, we are opening the blurred image that
we saved in line 24 and in the next step we are pasting the transparent
image on this blurred image.

If all done well then we will get this beautiful ***Bokeh Effect***

![](https://i0.wp.com/py2py.com/wp-content/uploads/2019/01/final-2.png?fit=750%2C1000&ssl=1)

![](https://i0.wp.com/py2py.com/wp-content/uploads/2019/01/final-2.png?fit=750%2C1000&ssl=1)

``` {.brush: .python; .first-line: .92; .title: .; .notranslate title=""}
im_blur= Image.open(file_save_blur)

file_save_final= os.path.join(path_save_folder,'final.png')
im_blur.paste(im2,(xs,ys),im2)
im_blur.save(file_save_final)
```

In the end we are showing the result and closing the windows to free up
the memory.

``` {.brush: .plain; .first-line: .98; .title: .; .notranslate title=""}
im_final= Image.open(file_save_final)
im_final.show('Final Result')
cv2.waitKey(0)
cv2.destroyAllWindows() 
```

This is all from my side, Hope you like this post, If you have any doubt
then please leave a comment and I will try to resolve it.

Thanks for Reading. 😀

* * * * *

### Share this: {.sd-title}

-   [Click to share on Twitter (Opens in new
    window)](https://py2py.com/bokeh-effect-in-image-using-python/?share=twitter "Click to share on Twitter")
-   [Click to share on Facebook (Opens in new
    window)](https://py2py.com/bokeh-effect-in-image-using-python/?share=facebook "Click to share on Facebook")
-   [Click to share on Google+ (Opens in new
    window)](https://py2py.com/bokeh-effect-in-image-using-python/?share=google-plus-1 "Click to share on Google+")
-   

### *Related* {.jp-relatedposts-headline}

Tags:[Background](https://py2py.com/tag/background/ "Background")[blur
background](https://py2py.com/tag/blur-background/ "blur background")[Bokeh](https://py2py.com/tag/bokeh/ "Bokeh")[Bokeh
effect](https://py2py.com/tag/bokeh-effect/ "Bokeh effect")[effect](https://py2py.com/tag/effect/ "effect")[image](https://py2py.com/tag/image/ "image")[OpenCV](https://py2py.com/tag/opencv/ "OpenCV")[PIL](https://py2py.com/tag/pil/ "PIL")[python](https://py2py.com/tag/python/ "python")

1 thought on “Bokeh Effect in Image using Python” {.comments-title}
-------------------------------------------------

1.  ![](https://secure.gravatar.com/avatar/466210ab9e41a15b0bb891642b2064a1?s=50&d=mm&r=g)

    ![](https://secure.gravatar.com/avatar/466210ab9e41a15b0bb891642b2064a1?s=50&d=mm&r=g)

    [YourFriendPablo](https://veryinterested.000webhostapp.com/)
    [January 31, 2019 at 9:30
    am](https://py2py.com/bokeh-effect-in-image-using-python/#comment-163)

    Great, I really like it! Youre awesome

    [Reply](/bokeh-effect-in-image-using-python/?replytocom=163#respond)

Leave a Reply [Cancel reply](/bokeh-effect-in-image-using-python/#respond) {#reply-title .comment-reply-title}
--------------------------------------------------------------------------

Your email address will not be published. Required fields are marked \*

Name \*

Email \*

Website

Comment

Notify me of follow-up comments by email.

Notify me of new posts by email.

Youtube Scraping

![](https://i2.wp.com/py2py.com/wp-content/uploads/2019/04/yt-logo-thumb.png?fit=300%2C202&ssl=1)

### [Youtube Scraping using python Part 3: Scraping Title and Description](https://py2py.com/private-youtube-scraping-using-python-part-3-scraping-title-and-description/)

Open CV

![](https://i2.wp.com/py2py.com/wp-content/uploads/2019/04/color-thumb.png?fit=300%2C192&ssl=1)

### [How to calculate the number of different colors in an image](https://py2py.com/how-to-calculate-the-number-of-different-colors-in-an-image/)

![](https://i0.wp.com/py2py.com/wp-content/uploads/2019/01/Screenshot-2019-01-30-at-2.14.43-PM.png?fit=300%2C206&ssl=1)

### [Bokeh Effect in Image using Python](https://py2py.com/bokeh-effect-in-image-using-python/)

Sentiment Analysis

![](https://i1.wp.com/py2py.com/wp-content/uploads/2019/02/sentiment-analysis-featured-image-updated.png?fit=300%2C203&ssl=1)

### [Twitter Sentiment Analysis part 5: Plotting Live Graph of Sentiment using Matplotlib](https://py2py.com/twitter-sentiment-analysis-part-5-plotting-live-graph-of-sentiment-using-matplotlib/)

In house Modules

![](https://i0.wp.com/py2py.com/wp-content/uploads/2019/01/Screenshot-2019-01-29-at-12.58.10-AM.png?fit=300%2C203&ssl=1)

### [Tracker for HSV model: Overview and Explanation](https://py2py.com/tracker-for-hsv-model-overview-and-explanation/)

![](https://i0.wp.com/py2py.com/wp-content/uploads/2019/01/Screenshot-2019-01-25-at-4.51.37-PM.png?fit=300%2C211&ssl=1)

### [Polygon Analysis: Overview and Explanation](https://py2py.com/polygon-analysis-overview-and-explanation/)

##### Contact: [[email protected]](/cdn-cgi/l/email-protection) {align="left"}

##### © py2py.com {align="left"}
