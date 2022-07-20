#for each directory in theimagedir do corresponding outcomein U2NetOUTPUT
import os
import gc
import glob
import shutil
import torch
import cv2
import argparse
import parser
import numpy as np
from PIL import Image
from pathlib import Path
from skimage import io, transform
from torch.autograd import Variable
from torchvision import transforms
from torch.utils.data import Dataset, DataLoader
from u2net_util import U2NetPrediction,LeafDataset,RescaleT

torch.cuda.empty_cache()
parser = argparse.ArgumentParser(description='Process apply_mask')
parser.add_argument('--apply_mask')
parser.add_argument('--batch_size', type=int, nargs='+',help='an integer for the accumulator')
parser.add_argument('--output_size', type=int, nargs='+',help='output masked image size')

args = vars(parser.parse_args())
apply_mask = args['apply_mask']
batch_size = args['batch_size'][0]
output_size = args['output_size'][0]


mask_interpolation  = cv2.INTER_CUBIC
# output of u2net is 320
# if arg parameter outputsize < 320 we need to enlarge image so we use cv2.INTER_CUBIC
if output_size:
  if output_size < 320:
    mask_interpolation  = cv2.INTER_CUBIC
  else:
    mask_interpolation  = cv2.INTER_AREA

if not batch_size:
  print("Auto assign batch_size = 1")
  batch_size = 1

def save_output(image_location,mask,segmented_dir,apply_mask):
    global mask_interpolation
    mask = mask.squeeze()
    mask_np = mask.cpu().data.numpy()
    if batch_size == 1:
      image_location = '/'.join(image_location)
    else:
      image_location = image_location
    image_name = os.path.basename(image_location)

    mask_np = mask_np*255
    image = cv2.imread(image_location)
    if not output_size:
      mask_image = cv2.resize(mask_np,(image.shape[1],image.shape[0]),interpolation = mask_interpolation)
    else:
      if image.shape[1] < output_size:
        image = cv2.resize(image,(output_size,output_size),interpolation = cv2.INTER_CUBIC)
      else:
        image = cv2.resize(image,(output_size,output_size),interpolation = cv2.INTER_AREA)
      mask_image = cv2.resize(mask_np,(output_size,output_size),interpolation = mask_interpolation)
      
    mask_image = mask_image.astype(np.uint8)
    if apply_mask:
      masked_image = cv2.bitwise_and(image,image,mask = mask_image)
    else:
      masked_image = mask_image

    cv2.imwrite(os.path.join(segmented_dir,"masked_"+image_name),masked_image)
    del masked_image
    gc.collect()

semanticSegmenter = U2NetPrediction()

root_dir = 'data'
output_root_dir = 'output'
skipfolder = {"cardamom_dataset":"Blight1000"}  # already segmented

if not apply_mask:
  output_root_dir = 'output_mask'

if output_size:
  output_root_dir = output_root_dir+'/'+str(output_size)

for datasetSplit in os.listdir(root_dir):
  print("Segmenting:-",datasetSplit)
  for dataset_dir in os.listdir(os.path.join(root_dir,datasetSplit)):
    for labeled_image_dir in os.listdir(os.path.join(root_dir,datasetSplit,dataset_dir)):
      
      image_dir = os.path.join(root_dir,datasetSplit,dataset_dir,labeled_image_dir)
      segmented_dir = os.path.join(output_root_dir,datasetSplit,dataset_dir,labeled_image_dir)
      
      try:
        if skipfolder[datasetSplit] == labeled_image_dir:
          if os.path.exists(segmented_dir):
            shutil.rmtree(segmented_dir, ignore_errors=False, onerror=None)
          shutil.copytree(image_dir, segmented_dir)

          # need to read all the images in the segmented_dir and convert it to
          # argument parameter output_size shape
          if output_size:
            for file1 in os.listdir(segmented_dir):
              segmented_dir_img = segmented_dir+"/"+file1
              img = cv2.imread(segmented_dir_img)
              if img.shape[1] < output_size:
                temp_image_interpolation = cv2.INTER_CUBIC
              else:
                temp_image_interpolation = cv2.INTER_AREA
              img = cv2.resize(img,(output_size,output_size),interpolation = temp_image_interpolation)
              cv2.imwrite(segmented_dir_img,img)
              del img,segmented_dir_img

          print("Copied Already Segmented to output",image_dir)
          continue
      except:
        pass

      Path(segmented_dir).mkdir(parents=True, exist_ok=True)
      img_name_list = glob.glob(image_dir + os.sep + '*')
  
      leaf_dataset = LeafDataset(imagelocationlist = img_name_list,
                                 transform=transforms.Compose([RescaleT(320),
                                                              transforms.ToTensor()])
                                          )
      leaf_dataloader = DataLoader(leaf_dataset,
                                   batch_size=batch_size,
                                   shuffle=False,
                                   num_workers=2)

      for image_data in leaf_dataloader:
        
        image = image_data['image']
        imagelocation = image_data['imagelocation']
        image = image.type(torch.FloatTensor)

        if torch.cuda.is_available():
              inputs_test = Variable(image.cuda())
        else:
              inputs_test = Variable(image)

        s1,s2,s3,s4,s5,s6,s7= semanticSegmenter.u2net(inputs_test)

        #since we included batchsize we need to iterate within batch
        del image
        gc.collect()
        torch.cuda.empty_cache()
        if batch_size !=1:
          for i in range(s1.shape[0]):
            mask = s1[i,0,:,:]
            mask = semanticSegmenter.normPRED(mask)
            save_output(imagelocation[i],mask,segmented_dir,apply_mask)
        else:
          mask = s1[:,0,:,:]
          mask = semanticSegmenter.normPRED(mask)
          save_output(imagelocation,mask,segmented_dir,apply_mask)

        del imagelocation,s1,s2,s3,s4,s5,s6,s7
        gc.collect()
      del leaf_dataloader,leaf_dataset