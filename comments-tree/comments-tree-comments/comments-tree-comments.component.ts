import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {AnswersService} from "../../../../src/app/services/answers.service";
import {User} from "../../../../src/app/services/user.type";


export class AnswerNode implements Answer {
  postId: string = '';
  parentId: string = '';
  commentId: string = '';

  user: User;

  title: string = '';
  text: string = '';
  answers: AnswerNode[] = [];

  votes: number = 0;

  likes: number = 0;
  dislikes: number = 0;
  happy: number = 0;
  angry: number = 0;
  surprise: number = 0;
  sad: number = 0;

  parentData: object;
  level: number;

  isOpen: boolean = false;

  constructor(comment) {
    Object.assign(this, comment);
  }
}


@Component({
  selector: 'comments-tree-comments',
  templateUrl: './comments-tree-comments.component.html',
  styleUrls: ['./comments-tree-comments.component.scss']
})
export class CommentsTreeCommentsComponent {
  @Input() postId: string;
  @Input() comments: AnswerNode[] = [];
  @Input() user: User;

  newComment: string;

  constructor(
    private answersService: AnswersService
  ) {

  }

  highlightComments(event) {

  }

  addComment(parentComment: AnswerNode) {
    const comment = new AnswerNode({
      postId: this.postId,
      parentId: parentComment.commentId,
      user: this.user,
      text: this.newComment,
      level: parentComment.level + 1,
      parentData: {
        userName: parentComment.user.userName
      }
    });

    parentComment.answers.push(comment);
    parentComment.isOpen = false;

    this.answersService.add(comment)
      .then(result => {
        comment.commentId = result.objectId;
      });
  }

  openCommentText(event, comment) {
    event.preventDefault();
    comment.isOpen = !comment.isOpen;
  }

  ban() {

  }
}
