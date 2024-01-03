import "./style.css";

type User = {
  id: number;
  name: string;
  picture: string;
};

type Comment = {
  userId: number;
  createdAt: string;
  body: string;
};

type Post = {
  title: string;
  body: string;
  createdAt: string;
  likes: number[];
  comments: Comment[];
};

var posts: Post[] = [];
var users: User[] = [];

function fetchData() {
  Promise.all([
    fetch(
      "https://jmrfrosa.github.io/edit-jsts-dec2023.github.io/data/users.json"
    ).then((response) => response.json()),
    fetch(
      "https://jmrfrosa.github.io/edit-jsts-dec2023.github.io/data/posts.json"
    ).then((response) => response.json()),
  ]).then((values) => {
    console.log(values);
    users = values[0];
    posts = values[1];
    posts = posts.sort((post1, post2) => post1.createdAt >= post2.createdAt);
    printPost(posts, users);
  });
}

function searchPosts() {
  const searchText = document.getElementById("input-search").value;
  if (searchText.length > 0) {
    const filteredPosts = posts.filter(
      (post) => post.title.search(searchText) > 0
    );
    printPost(filteredPosts, users);
  } else {
    printPost(posts, users);
  }
}

function printComment(comments: Comment[], users: User[]) {
  const commentsHtml = comments.map((comment) => {
    const user = users.find((user) => user.id == comment.userId);
    const date = new Date(comment.createdAt);
    const commentHtml = ` <div id="comments">
    <img
      class="img-autor"
      src="${user.picture}"
    />
    <p> ${user.name}</p>
    <p>${comment.body}</p>
    <p>${formatDate(date)}</p>
  </div>
    `;
    return commentHtml;
  });
  return commentsHtml;
}

function printPost(posts: Post[], users: User[]) {
  document.querySelector<HTMLDivElement>(
    "#posts-number"
  )!.innerHTML = `(${posts.length}) Posts`;
  const postsHtml = posts.map((post) => {
    const date = new Date(post.createdAt);
    const postHtml = `
    <article >
    <div class="border-post">
      <div class="title-post"><h1>${post.title}</h1></div>
      <p id="posts">
      ${post.body}
      </p>
      </div>
      <div id="likes-data">
        <p>likes: ${post.likes.length}</p>
        <p> ${formatDate(date)}</p>
      </div>
      <br />
      ${printComment(post.comments, users)}
    </article>
    `;
    return postHtml;
  });
  document.querySelector<HTMLDivElement>("#app")!.innerHTML = postsHtml;
}
function formatDate(date: Date) {
  var months: any = {
    0: "Janeiro",
    1: "Fevereiro",
    2: "Março",
    3: "Abril",
    4: "Maio",
    5: "Junho",
    6: "Jullho",
    7: "Agosto",
    8: "Setembro",
    9: "Outubro",
    10: "Novembro",
    11: "Dezembro",
  };
  return `${date.getDay()} de ${
    months[date.getMonth()]
  } de ${date.getFullYear()}, ${date.getHours()}h${date.getMinutes()}`;
}

function createPost() {
  alert(1);
  const title = document.getElementById("new-post-id").value;
  const newTextPost = document.getElementById("new-post-text").value;
  const date = new Date();

  const newPost: Post = {
    title: title,
    body: newTextPost,
    likes: [],
    comments: [],
    createdAt: date.toISOString(),
  };

  posts.push(newPost);
  printPost(posts, users);

  document.getElementById("new-post-id").value = "";
  document.getElementById("new-post-text").value = "";
}

fetchData();

window.createPost = createPost;
window.searchPosts = searchPosts;
