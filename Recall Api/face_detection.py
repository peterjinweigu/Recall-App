from PIL import Image
import numpy as np
import cv2, base64
from io import BytesIO
import sqlite3


def main(data):
    with open("img1.jpg", "wb") as fh:
        fh.write(base64.b64decode(data))

    img1 = cv2.imread("img1.jpg")
    
    # Convert into grayscale
    gray1 = cv2.cvtColor(img1, cv2.COLOR_BGR2GRAY)

    # Load the cascade
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_alt2.xml')
  
    # Detect faces
    faces1 = face_cascade.detectMultiScale(gray1, 1.1, 4)
  
    # Draw rectangle around the faces and crop the faces
    for (x, y, w, h) in faces1:
        img1 = cv2.rectangle(img1, (x, y), (x+w, y+h), (0, 0, 255), 2)
        img1 = img1[y:y + h, x:x + w]
        break
    
    cv2.imwrite('face1.jpg', img1)

    img1 = cv2.cvtColor(img1, cv2.COLOR_BGR2GRAY)

    # img1 = cv2.imread("face1.jpg")

    con = sqlite3.connect("database.db")

    minn = 100
    cur = ""

    for item in con.execute("SELECT img, name FROM labels").fetchall():
        name = item[1]

        with open("img2.jpg", "wb") as fh:
            fh.write(base64.b64decode(item[0]))

        img2 = cv2.imread("img2.jpg")
  
        # Convert into grayscale
        gray2 = cv2.cvtColor(img2, cv2.COLOR_BGR2GRAY)
  
        # Detect faces
        faces2 = face_cascade.detectMultiScale(gray2, 1.1, 4)
  
        # Draw rectangle around the faces and crop the faces
        for (x, y, w, h) in faces2:
            img2 = cv2.rectangle(img2, (x, y), (x+w, y+h), (0, 0, 255), 2)
            img2 = img2[y:y + h, x:x + w]
            break
        
        cv2.imwrite('face2.jpg', img2)
      

        # img2 = cv2.imread("face2.jpg")

        height1, width1 = img1.shape[0],img1.shape[1]  
        height2, width2 = img2.shape[0],img2.shape[1]  

        img1 = img1[0:min(height1, height2), 0:min(width1, width2)]
        img2 = img2[0:min(height1, height2), 0:min(width1, width2)]

        img2 = cv2.cvtColor(img2, cv2.COLOR_BGR2GRAY)
        # define the function to compute MSE between two images

        error, diff = mse(img1, img2)

        if error < minn:
            minn = error
            cur = name
    print(minn, name)
    if minn <= 50:
       return name
    return False 

# get mean square error of all pixels in both images to compare them
def mse(img1, img2):
    h, w = img1.shape
    diff = cv2.subtract(img1, img2)
    err = np.sum(diff**2)
    mse = err/(float(h*w))
    return mse, diff




