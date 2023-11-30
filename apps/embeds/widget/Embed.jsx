/**
 * Easypoll <- widgets
 * Video <- widgets
 * NFTs
 */

/**
 * TODO:
  * Uninstalling
  * Installing a full plugin

 */

// [EMBED](https://near.social/easypoll-v0.ndc-widgets.near/widget/EasyPoll?page=view_poll&src=clippy.near/easypoll-4.0.0/poll/339f6c601bdf7lp8qj7j39ec4733c053db)
const accountId = context.accountId;

// default embeds
const EmbedMap = new Map([
  [
    "mob.near/widget/MainPage.N.Post.Page",
    "mob.near/widget/MainPage.N.Post.Embed",
  ],
  [
    "mob.near/widget/MainPage.N.Post.Embed",
    "mob.near/widget/MainPage.N.Post.Embed",
  ],
  // [
  //   "easypoll-v0.ndc-widgets.near/widget/EasyPoll",
  //   "embeds.near/widget/Poll"
  // ]
]);

const installedEmbeds = JSON.parse(
  Social.get(`${accountId}/settings/every/embed`, "final") || "null"
);

if (installedEmbeds) {
  installedEmbeds.forEach((embed) => {
    EmbedMap.set(embed.widgetSrc, embed.embedSrc);
  });
}

const href = props.href;

const parseUrl = (url) => {
  if (typeof url !== "string") {
    return null;
  }
  if (url.startsWith("/")) {
    url = `https://near.social${url}`;
  }
  try {
    return new URL(url);
  } catch {
    return null;
  }
};

const parsed = useMemo(() => {
  const url = parseUrl(href);
  if (!url) {
    return null;
  }
  return {
    widgetSrc: url.pathname.substring(1),
    props: Object.fromEntries([...url.searchParams.entries()]),
  };
}, [href]);

function filterByWidgetSrc(obj, widgetSrcValue) {
  let result = [];

  function recurse(currentObj) {
    if (typeof currentObj === "object" && currentObj !== null) {
      if (
        currentObj.metadata &&
        currentObj.metadata.widgetSrc === widgetSrcValue
      ) {
        result.push(currentObj);
      }
      Object.values(currentObj).forEach((value) => recurse(value));
    }
  }

  recurse(obj);
  return result;
}

if (!parsed || !EmbedMap.has(parsed.widgetSrc)) {
  // get all the available embed plugins that use this widgetSrc
  // embed plugin will be able to be liked, starred, and you can see who is using it

  const availableEmbedPlugins = Social.get("*/plugin/embed/**", "final");
  const embedPlugins = filterByWidgetSrc(
    availableEmbedPlugins,
    parsed.widgetSrc
  );
  console.log("availableEmbedPlugins", availableEmbedPlugins);
  return (
    <div className="border">
      {embedPlugins.length ? (
        <>
          {embedPlugins.map((it) => {
            console.log("embeddable", it);
            const plugin = JSON.parse(it[""]);
            return (
              <div className="border">
                <Widget
                  src="embeds.near/widget/EmbedPlugin"
                  props={{ plugin }}
                />
              </div>
            );
          })}
        </>
      ) : (
        <p>No plugins found for this widget src</p>
      )}
      <a href={href}>{props.children}</a>
    </div>
  );
}

const Wrapper = styled.div`
  border-radius: 0.5em;
  width: 100%;
  overflow: hidden;
  border: 1px solid #eee;
  white-space: normal;
  margin-top: 12px;
`;

const widgetSrc = EmbedMap.get(parsed.widgetSrc);
return (
  <Wrapper>
    <Widget loading="" src={widgetSrc} props={parsed.props} />
  </Wrapper>
);
