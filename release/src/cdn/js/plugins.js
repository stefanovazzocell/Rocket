const salt='t6IcYm1fvwo0O+NwEo9JAqKwcn88zeqO/U1DZvCsgzK3GGa1QzOZpRNs2/sr17d7HNsIsoXhaTbjMk7sMRr5Rw==';var autolocation=window.location.protocol+'//'+window.location.hostname;var server=autolocation+':8080';var baseUrl=autolocation+'/';var alertTimeout=!1;function closeAlert(){clearTimeout(alertTimeout);alertTimeout=!1;$$('#alert').addClass('h')}
function msg(message,priority=!0){console.warn(message);if(priority||!alertTimeout){closeAlert();$$('#alert').html(message);alertTimeout=setTimeout(closeAlert,5000);$$('#alert').removeClass('h')}}
function encrypt(data,password){return sjcl.encrypt(password,data,{mode:'gcm'})}
function hash(data,iter=100000){return sjcl.codec.base64.fromBits(sjcl.hash.sha512.hash(sjcl.misc.pbkdf2(data,salt,iter)))}
function encryptData(data,parameters,link,bigData=!1,addPassword=!1){var d=data;if(addPassword!==!1){d=encrypt(data,addPassword);parameters.p=!0}
var p=JSON.stringify(parameters);d=encrypt(d,hash(link,100));p=encrypt(p,hash(link,100));var l=hash(link);if((d.length>(bigData?55000:2048))||p.length>512){return!1}
var out={'l':l,'d':d,'p':p};if(bigData){out.bd=!0}
return out}
function getMsg(xhr,message='An error has occurred, try again later'){try{var response=JSON.parse(xhr.responseText);msg(response.msg|message)}catch(err){msg(message)}}
function apiSet(callback,data,link,type,clicks,hours,passw,del,edit,stats,bigData=!1){if(link.length<1){msg('You must enter a short link');callback(!1);return}
var sOptions={};if(bigData){clicks=1;hours=1;del=!1;edit=!1;stats=!1}
if(stats!==!1){edit=!1;if(clicks<10)clicks=10;if(stats===''){sOptions.s=''}else{sOptions.s=hash(stats)}}
if(edit!==!1){if(edit==''){msg('Edit must have a password');callback(!1);return}
sOptions.e=hash(edit)}
if(del!==!1){if(del===''){sOptions.d=''}else{sOptions.d=hash(del)}}
var param=encryptData(data,{'t':type},link,bigData,passw);if(param){param.t='set';param.c=clicks;param.e=hours;param.o=sOptions;$$().post(server+'/api/000/',param,function(response){response=JSON.parse(response);if(response.msg){msg(response.msg)}
callback(response.a)},function(xhr){getMsg(xhr,'You are offline or temporarely banned');callback(!1)})}else{msg('There is too much data, try to enter less data');callback(!1)}}
function apiOpt(callback,link){$$().post(server+'/api/000/',{"t":"opt","l":link},function(response){response=JSON.parse(response);if(response.msg){msg(response.msg)}
if(response.f===!0){callback(response.o)}else if(response.f===!1){msg('Link expired',!1);callback(!1)}else{msg('An error has occurred, try again later',!1);callback(!1)}},function(xhr){getMsg(xhr);callback(!1)})}
function apiStats(callback,link,passw=!1){if(passw){passw=hash(passw)}else{passw=''}
$$().post(server+'/api/000/',{"t":"stats","p":passw,"l":link},function(response){response=JSON.parse(response);if(response.msg){msg(response.msg)}
if(response.f===!0&&response.p===!0){callback(response.s)}else if(response.f===!1){msg('Link expired',!1);callback(!1)}else if(response.p===!1){msg('Wrong Password',!1);callback(!1)}else{if(!response.msg){msg('An error has occurred, try again later')}
callback(!1)}},function(xhr){getMsg(xhr);callback(!1)})}
function apiDel(callback,link,passw=!1){if(passw){passw=hash(passw)}else{passw=''}
$$().post(server+'/api/000/',{"t":"del","p":passw,"l":link},function(response){response=JSON.parse(response);if(response.msg){msg(response.msg)}
if(response.f===!0&&response.p===!0){callback(!0)}else if(response.f===!1){msg('Link expired',!1);callback(!0)}else if(response.p===!1){msg('Wrong Password',!1);callback(!1)}else{msg('An error has occurred, try again later',!1);callback(!1)}},function(xhr){getMsg(xhr);callback(!1)})}
function apiEdit(callback,editPass,link,rawLink,dataPass,data,parameters,clicks){editPass=hash(editPass);var edit={};if(data===!1&&clicks===!1){msg('At least one of link/text or clicks should be changed');callback(!1);return}
if(clicks!==!1){edit.c=clicks;if(clicks<1)edit.c=1;if(clicks>1000)edit.c=1000}
if(data!==!1){var returned=encryptData(data,parameters,rawLink,!1,dataPass);if(returned===!1){callback(!1);return}
edit.d=returned.d;edit.p=returned.p}
$$().post(server+'/api/000/',{"t":"edit","p":editPass,"l":link,"e":edit},function(response){response=JSON.parse(response);if(response.msg){msg(response.msg)}
if(response.f===!0&&response.p===!0){callback(!0)}else if(response.f===!1||response.p===!1){callback(!1)}else{msg('An error has occurred, try again later',!1);callback(!1)}},function(xhr){getMsg(xhr);callback(!1)})}