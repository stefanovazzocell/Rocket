function decrypt(data,password){try{return sjcl.decrypt(password,data)}catch(err){return!1}}
function hash(data,iter=100000){return sjcl.codec.base64.fromBits(sjcl.hash.sha512.hash(sjcl.misc.pbkdf2(data,salt,iter)))}
const salt='t6IcYm1fvwo0O+NwEo9JAqKwcn88zeqO/U1DZvCsgzK3GGa1QzOZpRNs2/sr17d7HNsIsoXhaTbjMk7sMRr5Rw==';var autolocation=window.location.protocol+'//'+window.location.hostname;var server=autolocation+':8080';var baseUrl=autolocation+'/#';var alertTimeout=!1;function closeAlert(){clearTimeout(alertTimeout);alertTimeout=!1;$$('#alert').addClass('h')}
function msg(message,priority=!0){console.warn(message);if(priority||!alertTimeout){closeAlert();$$('#alert').html(message);alertTimeout=setTimeout(closeAlert,5000);$$('#alert').removeClass('h')}}
function getMsg(xhr,message='An error has occurred, try again later'){try{var response=JSON.parse(xhr.responseText);msg(response.msg|message)}catch(err){msg(message)}}
function apiGet(callback){var link=window.location.hash;if(!link){window.location.replace('create/')}else{link=link.substr(1)}
$$().post(server+'/api/000/',{"t":"get","l":hash(link),"track":document.location.pathname.includes('track')},function(response){response=JSON.parse(response);if(response.msg){msg(response.msg)}
if(response.f===!0){var out=decryptData(response.d,response.p,link);callback(out)}else if(response.f===!1){msg('Link expired',!1);callback(!1)}else{if(!response.msg){msg('An error has occurred, try again later')}
callback(!1)}},function(xhr){getMsg(xhr);callback(!1)})}
function decryptData(data,parameters,link){var d=decrypt(data,hash(link,100));var p=decrypt(parameters,hash(link,100));if(d===!1||p===!1){return!1}
p=JSON.parse(p);return{'d':d,'p':p}}
var encrypted_data;var data;var type;function showResults(){if(data===undefined){$$('form').removeClass('h')}else{switch(type){case 'url':if(!/^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/.test(data))data="http://"+data;$$('#url').val(data);$$('#isUrl').removeClass('h');break;case 'text':$$('#text').val(data);$$('#isText').removeClass('h');break;case 'img':if(data.startsWith('data:image/')==!1){type=!1;data='';msg('Suspicious data; for safety, it has been removed')}else{$$('#isImg').removeClass('h')}
break}
if(type)$$('#'+type+'Data').removeClass('hidden')}}
$$().ready(function(){$$('#visit').onClick(function(e){try{var win=window.open($$('#url').val(),'_blank');win.focus();window.location.replace('about:blank')}catch(err){msg('Error - The link is not valid')}});$$('#show').onClick(function(){$$('#warning').addClass('h');$$('#preview').prop('src',data);$$('#preview').removeClass('h')});$$('form').event('submit',function(event){event.preventDefault();$$('form').addClass('h');var decrypted=decrypt(encrypted_data,$$('#password').val());if(decrypted===!1){msg('Wrong Password');$$('form').removeClass('h')}else{data=decrypted;showResults()}});apiGet(function(apiData){$$('#isInit').addClass('h');if(apiData!==!1){if(apiData.p.hasOwnProperty('p')){encrypted_data=apiData.d}else{data=apiData.d}
type=apiData.p.t;showResults()}})})