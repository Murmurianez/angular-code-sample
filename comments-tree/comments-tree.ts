import {Component, Inject, Input, Renderer2} from "@angular/core";
import {User} from "../../../src/app/services/user.type";
import {AnswerNode} from "./comments-tree-comments/comments-tree-comments.component";
import {AnswersService} from "../../../src/app/services/answers.service";

@Component({
  selector: 'comments-tree',
  templateUrl: './comments-tree.html',
  styleUrls: ['./comments-tree.scss'],
  providers: [ AnswersService ]
})
export class CommentsTreeComponent {

  @Input() postId = 'DfPZlFCykP';
  @Input() user: User = {
    role: 'user',
    avatar: 'https://i.pravatar.cc/300',
    userName: 'Aleksey Andreev'
  };

  comments: Array<AnswerNode> = [];
  isLoading: boolean = true;

  constructor(private answersService: AnswersService) {

  }

  ngOnInit() {
    this.getData();
  }

  async getData() {
    const comments = await this.answersService.getComments(this.postId);
    this.isLoading = false;
    this.comments = comments.map(item => new AnswerNode(item));
  }
}
