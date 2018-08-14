'use strict';var type='',imgRender='';function randomString(a=10){for(var b='',c='ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789?/:@-._~!$&\'()*+,;=',d=void 0,f=0;f<a;f++){try{d=window.crypto.getRandomValues(new Uint8Array(1))[0]/255}catch(g){d=void 0}(null===d||d===void 0||isNaN(d)||1<d||0>d)&&(d=Math.random()),b+=c.charAt(Math.floor(d*c.length)),d=void 0}return b}function resizeImg(a){$$('form').addClass('h'),msg('Tuning the image, please wait...');var b=new Image,c=0,d=0,f=0.3,g=f,h='',j='';b.onload=function(){var k=document.createElement('canvas'),l=k.getContext('2d'),m=b.width,n=b.height,o=n*m;for(k.width=m,k.height=n;30700>=d&&1>=g;)h=j,l.clearRect(0,0,m,n),l.drawImage(b,0,0,m,n),j=k.toDataURL('image/jpeg',g),d=j.length,g==f&&30700<d?(c+=1,m*=0.8,n*=0.8,k.width=m,k.height=n,d=0):g+=0.01;msg('Image tuned: quality at '+Math.round(100*g)+'%, and resized to '+Math.round(100*(m*n)/o)+'% the original size'),$$('form').removeClass('h'),imgRender=h,$$('#preview').prop('src',h)},b.src=a}function setInput(a){$$('#url,#text,#img').each(function(b){b.disabled=!0}),$$('#'+a).first().disabled=!1,type=a}$$().ready(function(){$$('#alert').onClick(function(){closeAlert()}),$$('.tabf').onClick(function(a){a.preventDefault();var b=this.getAttribute('for'),c=$$('.tabf');'img'==b?$$('.noImage').addClass('h'):$$('.noImage').removeClass('h'),c.addClass('btn--gray'),c.removeClass('btn--blue'),this.classList.remove('btn--gray'),this.classList.add('btn--blue'),$$('.tabt > div').addClass('h'),$$('#'+b+'-tab').removeClass('h'),setInput(b)}),$$('#showopt').onClick(function(a){a.preventDefault(),$$('#extras').toggleClass('h')}),$$('.change').onClick(function(a){a.preventDefault();var b=$$('#'+this.getAttribute('data-target')),c=parseInt(this.getAttribute('data-delta'))+parseInt(b.val());c>b.prop('max')?b.val(b.prop('max')):c<b.prop('min')?b.val(b.prop('min')):b.val(c)}),$$('input[type="checkbox"]').event('change',function(){var a=this.getAttribute('for');null!==a&&($$('#'+a).first().disabled=!this.checked),'edit'===a&&$$('#optStats').first().checked&&$$('#optStats').select(),'stats'===a&&($$('#clicks').first().min=this.checked?10:1,$$('#optEdit').first().checked&&$$('#optEdit').select())}),$$('#img').event('change',function(){if(3>$$('#img').val().length)return void $$('#preview').prop('src','');var a=$$('#img').first().files[0];try{var b=new FileReader;b.onloadend=function(){30700<b.result.length?resizeImg(b.result):(imgRender=b.result,$$('#preview').prop('src',b.result))},b.readAsDataURL(a)}catch(c){console.log(c),msg('Your browser doesn\'t support this feature')}}),$$('form').event('submit',function(a){a.preventDefault(),$$('form').addClass('h'),closeAlert();var b=parseInt($$('#clicks').val()),c=parseInt($$('#hours').val()),d=$$('#url').val();'text'==type&&(d=$$('#text').val()),'img'==type&&(d=imgRender,b=1,c=1),apiSet(function(f){if(f){$$('#final').val(baseUrl+($$('#optStats').first().checked?'track/':'')+$$('#link').val());var g='';$$('#optPassword').first().checked&&(g+='Your link password is <code>'+$$('#password').val()+'</code><br>'),$$('#optDel').first().checked&&''!==$$('#del').val()&&(g+='Your delete password is <code>'+$$('#del').val()+'</code><br>'),$$('#optDel').first().checked&&''===$$('#del').val()&&(g+='You have enabled public deletion<br>'),$$('#optEdit').first().checked&&(g+='Your edit password is <code>'+$$('#edit').val()+'</code><br>'),$$('#optStats').first().checked&&''!==$$('#stats').val()&&(g+='Your stats password is <code>'+$$('#stats').val()+'</code><br>'),$$('#optStats').first().checked&&''===$$('#stats').val()&&(g+='You have enabled public stats<br>'),$$('#remember').html(g),$$('.ready').removeClass('h')}else msg('Link taken, try another link',!1),$$('form').removeClass('h')},d,$$('#link').val(),type,b,c,!!$$('#optPassword').first().checked&&$$('#password').val(),!!$$('#optDel').first().checked&&$$('#del').val(),!!$$('#optEdit').first().checked&&$$('#edit').val(),!!$$('#optStats').first().checked&&$$('#stats').val(),'img'==type)}),$$('#copy').onClick(function(a){a.preventDefault();var b=$$('#final').first();b.setSelectionRange(0,b.value.length),b.select(),document.execCommand('copy')}),$$('#close').onClick(function(a){a.preventDefault(),$$('#link').val(randomString()),$$('form').removeClass('h'),$$('.ready').addClass('h')}),$$('.random').onClick(function(a){a.preventDefault(),$$('#'+this.getAttribute('for')).val(randomString(30))}),$$('#link').val(randomString()),setInput('url'),$$('.disOnStart').each(function(a){a.disabled=!0})});