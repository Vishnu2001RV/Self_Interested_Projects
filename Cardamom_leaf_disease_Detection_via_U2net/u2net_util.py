# utility functions
import gc
import os
import glob
from PIL import Image
from pathlib import Path
from skimage import io, transform

import cv2
import torch
import numpy as np
from models import U2NET
from torchvision import transforms
from torch.autograd import Variable
from torch.utils.data import Dataset, DataLoader

class U2NetPrediction:
  model_name = "u2net"
  model_dir = os.path.join(os.getcwd(), 'saved_models', model_name, model_name + '.pth')
  u2net = U2NET(3,1)
  initialized = False

  def __init__(self,transform = None):
    if U2NetPrediction.initialized == False:
      if torch.cuda.is_available():
           U2NetPrediction.u2net.load_state_dict(torch.load(U2NetPrediction.model_dir))
           U2NetPrediction.u2net.cuda()
      else:
           U2NetPrediction.u2net.load_state_dict(torch.load(U2NetPrediction.model_dir,
                                                            map_location='cpu'))
      U2NetPrediction.initialized = True
    else:
      pass
    U2NetPrediction.u2net.eval()
    self.transform = transform
    self.prediction = None

  # normalize the predicted SOD probability map
  def normPRED(self,d):
    ma = torch.max(d)
    mi = torch.min(d)
    dn = (d-mi)/(ma-mi)
    del ma,mi
    gc.collect()
    return dn

  def semanticSegmentation(self,image = None,apply_mask=False):
    
    height,width = image.shape[:2]
    
    original = image.copy()
    # apply the trainsformaton to image if transformation present
    if self.transform:
      image = self.transform(image)
    image = image.type(torch.FloatTensor)
    image = image.unsqueeze(0)
    if torch.cuda.is_available():
      image = Variable(image.cuda())
      s1,s2,s3,s4,s5,s6,s7= U2NetPrediction.u2net(image)
    else:
      image = Variable(image)
      s1,s2,s3,s4,s5,s6,s7= U2NetPrediction.u2net(image)
    #seeing the result of each will give idea on how to superimpose and generated mask
    self.S = (s1,s2,s3,s4,s5,s6,s7)

    mask = s1[:,0,:,:]
    mask = self.normPRED(mask)
    mask = mask.squeeze()
    mask_np = mask.cpu().data.numpy()

    mask_np = mask_np*255
    mask_image = cv2.resize(mask_np,(width,height),interpolation = cv2.INTER_AREA)
    mask_image = mask_image.astype(np.uint8)

    if apply_mask:
      masked_image =  cv2.bitwise_and(original,original,mask = mask_image)
    else:
      masked_image = mask_image

    # return only the salicency map to create the mask alone
    # rest availableinthe d1,d2,d3 etc variables
    return masked_image

class RescaleT(object):

    def __init__(self,output_size):
        assert isinstance(output_size,(int,tuple))
        self.output_size = output_size

    def __call__(self,image):
        
        h, w = image.shape[:2]

        # if isinstance(self.output_size,int):
        #     if h > w:
        #         new_h, new_w = self.output_size*h/w,self.output_size
        #     else:
        #         new_h, new_w = self.output_size,self.output_size*w/h
        # else:
        #     new_h, new_w = self.output_size
        new_h, new_w = self.output_size,self.output_size
        new_h, new_w = int(new_h), int(new_w)

        image = transform.resize(image,(new_h,new_w),mode='constant')

        return image

class LeafDataset(Dataset):
    """Plant Leaf dataset Generator"""

    def __init__(self, imagelocationlist, transform=None):
        """
        Args:
        imagelocationlist:- for getting list of images with their location
        transform:- for applying transformation to image
        """
        self.imagelocationlist =imagelocationlist
        self.transform = transform

    def __len__(self):
        return len(self.imagelocationlist)

    def __getitem__(self, idx):
        if torch.is_tensor(idx):
            idx = idx.tolist()
        
        image = io.imread(self.imagelocationlist[idx])
        imagelocation = self.imagelocationlist[idx]

        if self.transform:
          image = self.transform(image)

        return {'image':image,'imagelocation':imagelocation}    