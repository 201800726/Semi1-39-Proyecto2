import {
  StepperSelectionEvent,
  STEPPER_GLOBAL_OPTIONS,
} from '@angular/cdk/stepper';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import { PostService } from 'src/app/services/post.service';
import { PostModel } from 'src/models/post.model';
import { UserModel } from 'src/models/user.model';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {
        displayDefaultIndicatorType: false,
      },
    },
  ],
})
export class FeedComponent implements OnInit {
  @ViewChild('stepper')
  stepper!: MatStepper;
  public stepSelected: string;
  public next: boolean;

  public create_content: boolean;
  public add_comment: boolean;

  public posts: PostModel[];
  public new_publication: PostModel;

  public users: UserModel[];
  public friendship_requests: UserModel[];
  public show_requests: boolean;

  public myForm: FormGroup;

  public user: UserModel;

  constructor(
    private _snackBar: MatSnackBar,
    public fb: FormBuilder,
    private _postService: PostService
  ) {
    this.user = new UserModel();
    this.stepSelected = 'Friends';
    this.next = false;
    this.create_content = false;
    this.add_comment = false;
    this.new_publication = new PostModel();
    this.show_requests = false;
    this.friendship_requests = [];
    this.users = [];
    this.myForm = this.fb.group({
      img: [null],
    });
    this.posts = [
      {
        user_picture:
          'https://ps.w.org/metronet-profile-picture/assets/icon-256x256.png?rev=2464419',
        username: 'fulanita',
        date: '03/08/20 3:15 pm',
        picture:
          'https://sites.google.com/site/ilvoloenclase/_/rsrc/1479493717600/home/CuUTkb1WcAA5JOS.jpg',
        comment:
          'Il Volo è un gruppo musicale italiano composto da due tenori e un baritono: Piero Barone (Naro, 24 giugno 1993), Ignazio Boschetto (Bologna, 4 ottobre 1994) e Gianluca Ginoble (Roseto degli Abruzzi, 11 febbraio 1995).',
      },
      {
        user_picture:
          'https://d1hbpr09pwz0sk.cloudfront.net/profile_pic/camille-ricketts-4793e5f1',
        username: 'menganito',
        date: '04/08/20 5:25 pm',
        picture:
          'https://wp-growpro.s3-eu-west-1.amazonaws.com/media/2019/02/Que-ver-en-Los-Angeles.jpg',
        comment:
          'Los Angeles lies in a basin in Southern California, adjacent to the Pacific Ocean, with mountains as high as 10,000 feet (3,000 m), and deserts. The city, which covers about 469 square miles (1,210 km2), is the seat of Los Angeles County, the most populous county in the United States.',
      },
    ];
  }

  private async getPosts() {
    try {
      const data = await this._postService.getPosts(this.user.username);
      if (data['code'] === '200') {
        console.log(data['data']);
      }
    } catch (error) {}
  }

  ngOnInit(): void {
    const container = localStorage.getItem('user');
    if (container !== null) this.user = <UserModel>JSON.parse(container);
    this.getPosts();
  }
  ngAfterViewInit() {
    this.stepper.selectedIndex = 1;
  }

  cancel() {
    this.create_content = false;
    this.add_comment = false;
    this.new_publication = new PostModel();

    //TODO limpiar la publicacion
  }

  publish() {
    if (this.new_publication.pictureB64) {
      if (!this.add_comment) this.new_publication.comment = '';
      console.log(this.new_publication);
    } else {
      this.showSnackbar('No picture added :c');
    }
  }

  sendFriendshipRequest(user: UserModel) {
    //TODO service to send friendship requests
    console.log(user);
  }

  responseFriendshipRequest(answer: any) {
    //TODO service to answer friendship requests
    console.log(answer);
  }

  selectionChange(event: StepperSelectionEvent) {
    this.stepSelected = event.selectedStep.label;
    switch (this.stepSelected) {
      case 'Publications':
        this.next = true;
        break;
      case 'Friends':
        this.next = false;

        break;
    }
  }

  onFileSelected(event: any) {
    try {
      const file = (event.target as HTMLInputElement).files![0];
      if (file) {
        var temporal: string[] = file.name.split('.');
        var extension = temporal[1].toLocaleLowerCase();
        let extensiones = ['jpg', 'png', 'jpeg', 'ico', 'svg'];
        if (extensiones.indexOf(extension) == -1) {
          throw new Error();
        } else {
          this.convert64(file);
          this.myForm.patchValue({
            img: file,
          });

          this.myForm.get('img')?.updateValueAndValidity();
          const reader = new FileReader();
          reader.onload = () => {
            this.new_publication.picture = reader.result as string;
          };
          reader.readAsDataURL(file);
        }
      }
    } catch (error) {
      this.showSnackbar('Extension not allowed :o');
    }
  }

  private convert64(photo: any) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const base64 = e.target.result;
      this.new_publication.pictureB64 = base64.split(',')[1];
    };
    reader.readAsDataURL(photo);
  }

  showSnackbar(message: string) {
    this._snackBar.open(message, 'CLOSE', { duration: 3000 });
  }
}
