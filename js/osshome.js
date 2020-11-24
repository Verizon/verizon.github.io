$(function(){
  // support nice scrolling
  $('#hero-chevron').click(function(){
    $(window).scrollTo($('#projects'), 1000);
  });

  var header = $('#content-head')
  var pattern = new Trianglify({
    width: window.screen.width | header.outerWidth(),
    height: header.outerHeight()*1,
    cell_size: 40,
    seed: Math.random(),
    x_colors: 'Spectral'
  }).png()

  header.css('background-image', 'url('+pattern+')');
  header.css('background-repeat', 'no-repeat');

  var icons = {
    "sbt-blockade": "/img/icons/blockade.png",
    "delorean": "/img/icons/delorean.png",
    "knobs": "/img/icons/knobs.png",
    "journal": "/img/icons/journal.png",
    "remotely": "/img/icons/remotely.png",
    "quiver": "/img/icons/quiver.png",
    "sbt-rig": "/img/icons/sbt-rig.png",
    "memento": "/img/icons/memento.png",
    "nelson": "/img/icons/nelson.png",
    "lighthouse": "/img/icons/lighthouse.png",
    "helm": "/img/icons/helm.png",
    "ark": "/img/icons/ark.png"
  }
  var exclude = ["verizon.github.io", "remotely-demo"]

  // fetch the data from github
  $.get('https://api.github.com/orgs/verizon/repos', function(repos){
    var divs = '';
    var forkDivs = '';
    var repoList = [];
    repos.forEach(function(e, i){
      e.sortProperty = moment.utc(e.pushed_at).format("x");
      if(e.language && exclude.indexOf(e.name) === -1){repoList.push(e)}
    });

    repoList.sort(
      firstBy(function(a, b){return a.fork - b.fork})
      .thenBy(function (a, b){return b.sortProperty - a.sortProperty})
    );

    repoList.forEach(function(e, i){
      var icon = '';
      var date = moment.utc(e.pushed_at).fromNow();
      if(!icons[e.name]){
        icon = '/img/icons/missing.png';
      } else {
        icon = icons[e.name];
      }
      if(e.fork){
      forkDivs +=
        '<div class="panel panel-default repo-unit">'+
          '<div class="panel-heading repo-unit">'+
            '<h3 class="repo-name">'+e.name+'</h3>'+
          '</div>' +
          '<div class="panel-body repo-unit">'+
            '<p class="zeromargin text-left">last updated '+date+'</p>'+
            '<p class="text-left repo-language">built with '+e.language+'</p>'+
            '<p class="repo-description">'+e.description+'</p>'+
          '</div>' +
          '<div class="panel-footer repo-unit">' +
            '<a href="'+encodeURI(e.homepage || e.html_url)+'" target="_blank">' +
              '<div class="repo-button-container">' +
                '<button class="custom-1">view</button>' +
              '</div>' +
            '</a>' +
          '</div>' +
        '</div>'
      } else {
        divs +=
          '<div class="panel panel-default repo-unit">'+
            '<div class="panel-heading repo-unit">'+
              '<img class="repo-avatar" src="'+icon+'" alt="Not available" />'+
              '<h3 class="repo-name">'+e.name+'</h3>'+
            '</div>' +
            '<div class="panel-body repo-unit">'+
              '<p class="zeromargin text-left">last updated '+date+'</p>'+
              '<p class="text-left repo-language">built with '+e.language+'</p>'+
              '<p class="repo-description">'+e.description+'</p>'+
            '</div>' +
            '<div class="panel-footer repo-unit">' +
              '<a href="'+encodeURI(e.homepage || e.html_url)+'" target="_blank">' +
                '<div class="repo-button-container">' +
                  '<button class="custom-1">view</button>' +
                '</div>' +
              '</a>' +
            '</div>' +
          '</div>'
      }
    });

    $('#projects').html(divs + "<br/><h2>Forks</h2>" + forkDivs);
  });
});
