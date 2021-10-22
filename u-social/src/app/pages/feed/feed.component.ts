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

import { FriendshipService } from 'src/app/services/friendship.service';

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
  public new_post: PostModel;

  public users: UserModel[];
  public friendship_requests: UserModel[];
  public show_requests: boolean;

  public myForm: FormGroup;

  public user: UserModel;

  constructor(
    private _snackBar: MatSnackBar,
    public fb: FormBuilder,
    private _postService: PostService,
    private _friendshipService: FriendshipService
  ) {
    this.user = new UserModel();
    this.stepSelected = 'Friends';
    this.next = false;
    this.create_content = false;
    this.add_comment = false;
    this.new_post = new PostModel();
    this.show_requests = false;
    this.friendship_requests = [];
    this.posts = [];
    this.users = [];
    this.myForm = this.fb.group({
      img: [null],
    });
  }

  public async getPosts(filters: string[] = []) {
    try {
      this.posts = [];
      if (filters.length > 0) {
        const data = await this._postService.getFilteredPosts(
          filters,
          this.user.username
        );
        if (data['code'] === '200') {
          this.mapPost(data['data']);
        }
      } else {
        const data = await this._postService.getPosts(this.user.username);
        if (data['code'] === '200') {
          this.mapPost(data['data']);
        }
      }
    } catch (error) {}
  }

  private mapPost(pubs: []) {
    pubs.forEach((element: any) => {
      const post = new PostModel();
      post.user_picture = element.profile_picture;
      post.date = new Date(element.date).toDateString();
      post.username = element.user;
      post.comment = element.text;
      post.picture = element.image;
      this.posts.push(post);
    });
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
    this.new_post = new PostModel();
  }

  public async publish() {
    try {
      if (this.new_post.pictureB64) {
        if (!this.add_comment) this.new_post.comment = '';
        this.new_post.username = this.user.username;
        const data = await this._postService.post(this.new_post);
        if (data['code'] === '200') {
          this.showSnackbar('Posted successfully c:');
          this.getPosts();
          this.cancel();
        }
      } else {
        this.showSnackbar('No picture added :c');
      }
    } catch (error) {
      this.showSnackbar();
    }
  }

  public async getNoFriends() {
    try {
      this.show_requests = !this.show_requests;
      const data = await this._friendshipService.getNoFriends(
        this.user.username
      );
      if (data['code'] === '200') {
        this.users = data['data'];
      }
      const data2 = await this._friendshipService.getRequests(
        this.user.username
      );
      if (data2['code'] === '200') {
        this.friendship_requests = data2['data'];
      }
    } catch (error) {}
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
      case 'Posts':
        this.next = true;
        this.getPosts();
        break;
      case 'Friends':
        this.next = false;
        this.getNoFriends();
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
            this.new_post.picture = reader.result as string;
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
      this.new_post.pictureB64 = base64.split(',')[1];
    };
    reader.readAsDataURL(photo);
  }

  showSnackbar(message: string = 'Something went wrogn :c') {
    this._snackBar.open(message, 'CLOSE', { duration: 3000 });
  }
}
