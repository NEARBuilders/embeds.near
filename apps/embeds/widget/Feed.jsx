const { Feed } = VM.require("devs.near/widget/Module.Feed");

Feed = Feed || (() => <></>); // make sure you have this or else it can break

return (
  <Feed
    index={{
      action: "post",
      key: "main",
      options: {
        limit: 10,
        order: "desc",
        accountId: ["efiz.near"],
      },
    }}
    Item={(p) => {
      return (
        <Widget
          src="embeds.near/widget/Post.Index"
          props={{ accountId: p.accountId, blockHeight: p.blockHeight }}
        />
      );
    }}
  />
);
