<h1 align="center">Folder Structure:- data</h1>
<h2>Corresponding training images should be arranged based on the given folder structure.</h2>
<p>The train-test split is given in the PDF</p>

``` python
data:
¦   
¦
+---cardamom_dataset
¦   +---test
¦   ¦   +---Blight1000
¦   ¦   +---Healthy_1000
¦   ¦   +---Phylosticta_LS_1000
¦   +---train
¦   ¦   +---Blight1000
¦   ¦   +---Healthy_1000
¦   ¦   +---Phylosticta_LS_1000
¦   +---val
¦       +---Blight1000
¦       +---Healthy_1000
¦       +---Phylosticta_LS_1000
+---grape_dataset
    +---test
    ¦   +---Grape___Black_rot
    ¦   +---Grape___Esca_(Black_Measles)
    ¦   +---Grape___healthy
    ¦   +---Grape___Leaf_blight_(Isariopsis_Leaf_Spot)
    +---train
    ¦   +---Grape___Black_rot
    ¦   +---Grape___Esca_(Black_Measles)
    ¦   +---Grape___healthy
    ¦   +---Grape___Leaf_blight_(Isariopsis_Leaf_Spot)
    +---val
        +---Grape___Black_rot
        +---Grape___Esca_(Black_Measles)
        +---Grape___healthy
        +---Grape___Leaf_blight_(Isariopsis_Leaf_Spot)

```

<h1 align="center"> THE COMPLETE FOLDER STRUCTURE </h1>

``` python
Cardamom_leaf_disease_Detection_via_U2net:
¦   cardamom_dataset_5_Fold_Result.csv
¦   ClassifierModels_V(2).ipynb
¦   grape_dataset_5_Fold_Result.csv
¦   MasterU2Net.ipynb
¦   Reshaped_Dataset_OUTPUTS.ipynb
¦   sample_masked(s0).jpg
¦   sample_masked(s6).jpg
¦   u2net_SegmentFolders.py
¦   u2net_util.py
¦   
+---5FoldOutput
¦   +---224
¦   ¦   ¦   cardamom_dataset.csv
¦   ¦   ¦   grape_dataset.csv
¦   ¦   ¦   
¦   ¦   +---cardamom_dataset
¦   ¦   ¦   +---fulldataset
¦   ¦   ¦   +---test
¦   ¦   ¦   ¦   +---Blight1000
¦   ¦   ¦   ¦   +---Healthy_1000
¦   ¦   ¦   ¦   +---Phylosticta_LS_1000
¦   ¦   ¦   +---train
¦   ¦   ¦   ¦   +---Blight1000
¦   ¦   ¦   ¦   +---Healthy_1000
¦   ¦   ¦   ¦   +---Phylosticta_LS_1000
¦   ¦   ¦   +---val
¦   ¦   ¦       +---Blight1000
¦   ¦   ¦       +---Healthy_1000
¦   ¦   ¦       +---Phylosticta_LS_1000
¦   ¦   +---grape_dataset
¦   ¦       +---fulldataset
¦   ¦       +---test
¦   ¦       ¦   +---Grape___Black_rot
¦   ¦       ¦   +---Grape___Esca_(Black_Measles)
¦   ¦       ¦   +---Grape___healthy
¦   ¦       ¦   +---Grape___Leaf_blight_(Isariopsis_Leaf_Spot)
¦   ¦       +---train
¦   ¦       ¦   +---Grape___Black_rot
¦   ¦       ¦   +---Grape___Esca_(Black_Measles)
¦   ¦       ¦   +---Grape___healthy
¦   ¦       ¦   +---Grape___Leaf_blight_(Isariopsis_Leaf_Spot)
¦   ¦       +---val
¦   ¦           +---Grape___Black_rot
¦   ¦           +---Grape___Esca_(Black_Measles)
¦   ¦           +---Grape___healthy
¦   ¦           +---Grape___Leaf_blight_(Isariopsis_Leaf_Spot)
¦   +---384
¦   ¦   ¦   cardamom_dataset.csv
¦   ¦   ¦   grape_dataset.csv
¦   ¦   ¦   
¦   ¦   +---cardamom_dataset
¦   ¦   ¦   +---fulldataset
¦   ¦   ¦   +---test
¦   ¦   ¦   ¦   +---Blight1000
¦   ¦   ¦   ¦   +---Healthy_1000
¦   ¦   ¦   ¦   +---Phylosticta_LS_1000
¦   ¦   ¦   +---train
¦   ¦   ¦   ¦   +---Blight1000
¦   ¦   ¦   ¦   +---Healthy_1000
¦   ¦   ¦   ¦   +---Phylosticta_LS_1000
¦   ¦   ¦   +---val
¦   ¦   ¦       +---Blight1000
¦   ¦   ¦       +---Healthy_1000
¦   ¦   ¦       +---Phylosticta_LS_1000
¦   ¦   +---grape_dataset
¦   ¦       +---fulldataset
¦   ¦       +---test
¦   ¦       ¦   +---Grape___Black_rot
¦   ¦       ¦   +---Grape___Esca_(Black_Measles)
¦   ¦       ¦   +---Grape___healthy
¦   ¦       ¦   +---Grape___Leaf_blight_(Isariopsis_Leaf_Spot)
¦   ¦       +---train
¦   ¦       ¦   +---Grape___Black_rot
¦   ¦       ¦   +---Grape___Esca_(Black_Measles)
¦   ¦       ¦   +---Grape___healthy
¦   ¦       ¦   +---Grape___Leaf_blight_(Isariopsis_Leaf_Spot)
¦   ¦       +---val
¦   ¦           +---Grape___Black_rot
¦   ¦           +---Grape___Esca_(Black_Measles)
¦   ¦           +---Grape___healthy
¦   ¦           +---Grape___Leaf_blight_(Isariopsis_Leaf_Spot)
¦   +---480
¦   ¦   ¦   cardamom_dataset.csv
¦   ¦   ¦   grape_dataset.csv
¦   ¦   ¦   
¦   ¦   +---cardamom_dataset
¦   ¦   ¦   +---fulldataset
¦   ¦   ¦   +---test
¦   ¦   ¦   ¦   +---Blight1000
¦   ¦   ¦   ¦   +---Healthy_1000
¦   ¦   ¦   ¦   +---Phylosticta_LS_1000
¦   ¦   ¦   +---train
¦   ¦   ¦   ¦   +---Blight1000
¦   ¦   ¦   ¦   +---Healthy_1000
¦   ¦   ¦   ¦   +---Phylosticta_LS_1000
¦   ¦   ¦   +---val
¦   ¦   ¦       +---Blight1000
¦   ¦   ¦       +---Healthy_1000
¦   ¦   ¦       +---Phylosticta_LS_1000
¦   ¦   +---grape_dataset
¦   ¦       +---fulldataset
¦   ¦       +---test
¦   ¦       ¦   +---Grape___Black_rot
¦   ¦       ¦   +---Grape___Esca_(Black_Measles)
¦   ¦       ¦   +---Grape___healthy
¦   ¦       ¦   +---Grape___Leaf_blight_(Isariopsis_Leaf_Spot)
¦   ¦       +---train
¦   ¦       ¦   +---Grape___Black_rot
¦   ¦       ¦   +---Grape___Esca_(Black_Measles)
¦   ¦       ¦   +---Grape___healthy
¦   ¦       ¦   +---Grape___Leaf_blight_(Isariopsis_Leaf_Spot)
¦   ¦       +---val
¦   ¦           +---Grape___Black_rot
¦   ¦           +---Grape___Esca_(Black_Measles)
¦   ¦           +---Grape___healthy
¦   ¦           +---Grape___Leaf_blight_(Isariopsis_Leaf_Spot)
¦   +---cardamom_dataset
¦   ¦   +---test
¦   ¦   ¦   +---Blight1000
¦   ¦   ¦   +---Healthy_1000
¦   ¦   ¦   +---Phylosticta_LS_1000
¦   ¦   +---train
¦   ¦   ¦   +---Blight1000
¦   ¦   ¦   +---Healthy_1000
¦   ¦   ¦   +---Phylosticta_LS_1000
¦   ¦   +---val
¦   ¦       +---Blight1000
¦   ¦       +---Healthy_1000
¦   ¦       +---Phylosticta_LS_1000
¦   +---grape_dataset
¦       +---test
¦       ¦   +---Grape___Black_rot
¦       ¦   +---Grape___Esca_(Black_Measles)
¦       ¦   +---Grape___healthy
¦       ¦   +---Grape___Leaf_blight_(Isariopsis_Leaf_Spot)
¦       +---train
¦       ¦   +---Grape___Black_rot
¦       ¦   +---Grape___Esca_(Black_Measles)
¦       ¦   +---Grape___healthy
¦       ¦   +---Grape___Leaf_blight_(Isariopsis_Leaf_Spot)
¦       +---val
¦           +---Grape___Black_rot
¦           +---Grape___Esca_(Black_Measles)
¦           +---Grape___healthy
¦           +---Grape___Leaf_blight_(Isariopsis_Leaf_Spot)
+---data
¦   +---cardamom_dataset
¦   ¦   +---test
¦   ¦   ¦   +---Blight1000
¦   ¦   ¦   +---Healthy_1000
¦   ¦   ¦   +---Phylosticta_LS_1000
¦   ¦   +---train
¦   ¦   ¦   +---Blight1000
¦   ¦   ¦   +---Healthy_1000
¦   ¦   ¦   +---Phylosticta_LS_1000
¦   ¦   +---val
¦   ¦       +---Blight1000
¦   ¦       +---Healthy_1000
¦   ¦       +---Phylosticta_LS_1000
¦   +---grape_dataset
¦       +---test
¦       ¦   +---Grape___Black_rot
¦       ¦   +---Grape___Esca_(Black_Measles)
¦       ¦   +---Grape___healthy
¦       ¦   +---Grape___Leaf_blight_(Isariopsis_Leaf_Spot)
¦       +---train
¦       ¦   +---Grape___Black_rot
¦       ¦   +---Grape___Esca_(Black_Measles)
¦       ¦   +---Grape___healthy
¦       ¦   +---Grape___Leaf_blight_(Isariopsis_Leaf_Spot)
¦       +---val
¦           +---Grape___Black_rot
¦           +---Grape___Esca_(Black_Measles)
¦           +---Grape___healthy
¦           +---Grape___Leaf_blight_(Isariopsis_Leaf_Spot)
+---output
¦   +---224
¦   ¦   +---cardamom_dataset
¦   ¦   ¦   +---test
¦   ¦   ¦   ¦   +---Blight1000
¦   ¦   ¦   ¦   +---Healthy_1000
¦   ¦   ¦   ¦   +---Phylosticta_LS_1000
¦   ¦   ¦   +---train
¦   ¦   ¦   ¦   +---Blight1000
¦   ¦   ¦   ¦   +---Healthy_1000
¦   ¦   ¦   ¦   +---Phylosticta_LS_1000
¦   ¦   ¦   +---val
¦   ¦   ¦       +---Blight1000
¦   ¦   ¦       +---Healthy_1000
¦   ¦   ¦       +---Phylosticta_LS_1000
¦   ¦   +---grape_dataset
¦   ¦       +---test
¦   ¦       ¦   +---Grape___Black_rot
¦   ¦       ¦   +---Grape___Esca_(Black_Measles)
¦   ¦       ¦   +---Grape___healthy
¦   ¦       ¦   +---Grape___Leaf_blight_(Isariopsis_Leaf_Spot)
¦   ¦       +---train
¦   ¦       ¦   +---Grape___Black_rot
¦   ¦       ¦   +---Grape___Esca_(Black_Measles)
¦   ¦       ¦   +---Grape___healthy
¦   ¦       ¦   +---Grape___Leaf_blight_(Isariopsis_Leaf_Spot)
¦   ¦       +---val
¦   ¦           +---Grape___Black_rot
¦   ¦           +---Grape___Esca_(Black_Measles)
¦   ¦           +---Grape___healthy
¦   ¦           +---Grape___Leaf_blight_(Isariopsis_Leaf_Spot)
¦   +---384
¦   ¦   +---cardamom_dataset
¦   ¦   ¦   +---test
¦   ¦   ¦   ¦   +---Blight1000
¦   ¦   ¦   ¦   +---Healthy_1000
¦   ¦   ¦   ¦   +---Phylosticta_LS_1000
¦   ¦   ¦   +---train
¦   ¦   ¦   ¦   +---Blight1000
¦   ¦   ¦   ¦   +---Healthy_1000
¦   ¦   ¦   ¦   +---Phylosticta_LS_1000
¦   ¦   ¦   +---val
¦   ¦   ¦       +---Blight1000
¦   ¦   ¦       +---Healthy_1000
¦   ¦   ¦       +---Phylosticta_LS_1000
¦   ¦   +---grape_dataset
¦   ¦       +---test
¦   ¦       ¦   +---Grape___Black_rot
¦   ¦       ¦   +---Grape___Esca_(Black_Measles)
¦   ¦       ¦   +---Grape___healthy
¦   ¦       ¦   +---Grape___Leaf_blight_(Isariopsis_Leaf_Spot)
¦   ¦       +---train
¦   ¦       ¦   +---Grape___Black_rot
¦   ¦       ¦   +---Grape___Esca_(Black_Measles)
¦   ¦       ¦   +---Grape___healthy
¦   ¦       ¦   +---Grape___Leaf_blight_(Isariopsis_Leaf_Spot)
¦   ¦       +---val
¦   ¦           +---Grape___Black_rot
¦   ¦           +---Grape___Esca_(Black_Measles)
¦   ¦           +---Grape___healthy
¦   ¦           +---Grape___Leaf_blight_(Isariopsis_Leaf_Spot)
¦   +---480
¦   ¦   +---cardamom_dataset
¦   ¦   ¦   +---test
¦   ¦   ¦   ¦   +---Blight1000
¦   ¦   ¦   ¦   +---Healthy_1000
¦   ¦   ¦   ¦   +---Phylosticta_LS_1000
¦   ¦   ¦   +---train
¦   ¦   ¦   ¦   +---Blight1000
¦   ¦   ¦   ¦   +---Healthy_1000
¦   ¦   ¦   ¦   +---Phylosticta_LS_1000
¦   ¦   ¦   +---val
¦   ¦   ¦       +---Blight1000
¦   ¦   ¦       +---Healthy_1000
¦   ¦   ¦       +---Phylosticta_LS_1000
¦   ¦   +---grape_dataset
¦   ¦       +---test
¦   ¦       ¦   +---Grape___Black_rot
¦   ¦       ¦   +---Grape___Esca_(Black_Measles)
¦   ¦       ¦   +---Grape___healthy
¦   ¦       ¦   +---Grape___Leaf_blight_(Isariopsis_Leaf_Spot)
¦   ¦       +---train
¦   ¦       ¦   +---Grape___Black_rot
¦   ¦       ¦   +---Grape___Esca_(Black_Measles)
¦   ¦       ¦   +---Grape___healthy
¦   ¦       ¦   +---Grape___Leaf_blight_(Isariopsis_Leaf_Spot)
¦   ¦       +---val
¦   ¦           +---Grape___Black_rot
¦   ¦           +---Grape___Esca_(Black_Measles)
¦   ¦           +---Grape___healthy
¦   ¦           +---Grape___Leaf_blight_(Isariopsis_Leaf_Spot)
¦   +---cardamom_dataset
¦   ¦   +---test
¦   ¦   ¦   +---Blight1000
¦   ¦   ¦   +---Healthy_1000
¦   ¦   ¦   +---Phylosticta_LS_1000
¦   ¦   +---train
¦   ¦   ¦   +---Blight1000
¦   ¦   ¦   +---Healthy_1000
¦   ¦   ¦   +---Phylosticta_LS_1000
¦   ¦   +---val
¦   ¦       +---Blight1000
¦   ¦       +---Healthy_1000
¦   ¦       +---Phylosticta_LS_1000
¦   +---grape_dataset
¦       +---test
¦       ¦   +---Grape___Black_rot
¦       ¦   +---Grape___Esca_(Black_Measles)
¦       ¦   +---Grape___healthy
¦       ¦   +---Grape___Leaf_blight_(Isariopsis_Leaf_Spot)
¦       +---train
¦       ¦   +---Grape___Black_rot
¦       ¦   +---Grape___Esca_(Black_Measles)
¦       ¦   +---Grape___healthy
¦       ¦   +---Grape___Leaf_blight_(Isariopsis_Leaf_Spot)
¦       +---val
¦           +---Grape___Black_rot
¦           +---Grape___Esca_(Black_Measles)
¦           +---Grape___healthy
¦           +---Grape___Leaf_blight_(Isariopsis_Leaf_Spot)
+---overridedOutput
¦   +---480
¦       +---cardamom_dataset
¦           +---train
¦               +---Blight1000
¦               +---Healthy_1000
¦               +---Phylosticta_LS_1000
+---saved_5_fold_models
¦   +---cardamom_dataset
¦   +---grape_dataset
+---trained_models_weight
    +---convolution
    ¦   +---cardamom_dataset
    ¦   +---grape_dataset
    +---efficientnet
    ¦   +---cardamom_dataset
    ¦   +---grape_dataset
    +---efficientnetv2-l
    ¦   +---cardamom_dataset
    ¦   +---grape_dataset
    +---efficientnetv2-m
    ¦   +---cardamom_dataset
    ¦   +---grape_dataset
    +---efficientnetv2-s
        +---cardamom_dataset
        +---grape_dataset
```
