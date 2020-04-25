import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {InitService} from "./init.service";
import {
  Answer
} from "../../../library-client/components/comments/answers/answers.component";
import {linksRegex, phoneNumbersRegex} from "../../../library-client/utils";


@Injectable()
export class AnswersService {
  constructor(private httpClient: HttpClient, private init: InitService) {

  }

  getComments(postId) {
    const Post = this.init.Parse.Object.extend('Post');
    const innerQuery = new this.init.Parse.Query(Post);

    innerQuery.get(postId);

    const Comment = this.init.Parse.Object.extend('Comment');
    const query = new this.init.Parse.Query(Comment);

    query.matchesQuery('post', innerQuery);
    query.select('objectId', 'content', 'parent', 'owner', 'image', 'title', 'likes');

    return query.find().then(results => {
      const preparedData: Answer[] = this.prepareFormat(results.map(item => item.toJSON()) || []);
      return this.buildTree(preparedData);
    }, error => {
      if (typeof document !== 'undefined') console.error('Error while fetching Comment', error);
    });
  }

  add(comment: Answer) {
    const Comment = this.init.Parse.Object.extend('Comment');
    const query = new Comment();

    const Post = this.init.Parse.Object.extend('Post');
    const postIdPointer = Post.createWithoutData(comment.postId);

    query.set('post', postIdPointer);
    query.set('parent', comment.parentId);
    query.set('owner', comment.user.userName);
    query.set('image', comment.user.avatar);
    query.set('title', comment.title);
    query.set('content', comment.text);

    return query.save().then(
      result => {
        return result.toJSON() || {};
      },
      error => {
        console.error('Error while creating ParseObject: ', error);
      }
    );
  }

  buildTree(items, parent = null, level = 0) {
    let result = [];
    const parentId = parent && parent.commentId || null;
    ++level;

    items.forEach(item => {
      if (item.parentId === parentId) {
        result.push(item);

        if(parent) item.parentData = {
          userName: parent.user.userName
        };
        item.level = level;
        item.answers = this.buildTree(items, item, level);
      }
    });

    return result;
  }


  prepareFormat(items): Answer[] {
    return items.map(item => ({
      // postId: string;
      parentId: item.parent || null,
      commentId: item.objectId,

      user: {
        role: 'user',
        avatar: item.image,
        userName: item.owner,
      },

      title: item.title,
      text: item.content,
      answers: [],

      votes: item.likes || 0,

      level: null,
      parentData: {}

      // likes: number;
      // dislikes: number;
      // happy: number;
      // angry: number;
      // surprise: number;
      // sad: number;
    }))
  }
}
