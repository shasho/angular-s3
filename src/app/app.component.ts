import {Component, NgZone} from '@angular/core';
import * as AWS from 'aws-sdk';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {Ng2ImgMaxService} from 'ng2-img-max';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  image: any;
  uploadedImage: File;

  constructor(private ng2ImgMax: Ng2ImgMaxService) {
  }


  fileEvent(fileInput: any) {

    let file = fileInput.target.files[0];

    //this.ng2ImgMax.resizeImage(file, 400, 300).subscribe(
    this.ng2ImgMax.compressImage(file, 0.5).subscribe(
      result => {

        this.uploadedImage = new File([result], result.name);
        const AWSService = AWS;
        const region = 'us-east-1';
        const bucketName = '424-test';
        const IdentityPoolId = 'XXXXXXXXXXXXXXXXXXXXXXXXXXס';

// Configures the AWS service and initial authorization
        AWSService.config.update({
          region: region,
          credentials: new AWSService.CognitoIdentityCredentials({
            IdentityPoolId: IdentityPoolId
          })
        });
// adds the S3 service, make sure the api version and bucket are correct
        const s3 = new AWSService.S3({
          apiVersion: '2006-03-01',
          params: {Bucket: bucketName}
        });
// I store this in a variable for retrieval later
        //this.image = file.name;
        console.log('start uploading', this.uploadedImage.name);
        s3.upload({Key: this.uploadedImage.name, Bucket: bucketName, Body: this.uploadedImage, ACL: 'public-read'}, function (err, data) {
          if (err) {
            console.log(err, 'there was an error uploading your file');
          } else console.log(data);
        });

      },
      error => {
        console.log('😢 Oh no!', error);
      }
    );
  }
}


