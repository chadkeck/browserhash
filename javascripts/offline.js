(function() {
  $(function() {
    var cache;
    $(window).bind("online offline", function(event) {
      return console.log(typeof navigator.onLine === "function" ? navigator.onLine({
        "online": "offline"
      }) : void 0);
    });
    cache = window.applicationCache;
    $(cache).bind("checking", function(event) {
      return console.log("checking for manifest");
    });
    $(cache).bind("noupdate", function(event) {
      return console.log("no update");
    });
    $(cache).bind("downloading", function(event) {
      return console.log("downloading cache");
    });
    $(cache).bind("progress", function(event) {
      return console.log("file downloaded");
    });
    $(cache).bind("cached", function(event) {
      return console.log("all files downloaded");
    });
    $(cache).bind("updateready", function(event) {
      return console.log("new cache available");
    });
    $(cache).bind("obsolete", function(event) {
      return console.log("manifest not found");
    });
    return $(cache).bind("error", function(event) {
      console.log("manifest error:");
      return console.log(event);
    });
  });
}).call(this);
