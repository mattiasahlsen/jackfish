webpackJsonp([1],{"1MTY":function(t,e){},"8Tgm":function(t,e){},NHnr:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=i("7+uW"),r={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",{attrs:{id:"app"}},[e("router-view")],1)},staticRenderFns:[]};var s=i("VU/8")({name:"App"},r,!1,function(t){i("gsu9")},null,null).exports,a=i("/ocq"),o=i("//Fk"),h=i.n(o),c=0,u=1,l=["P","N","B","R","Q","K","p","n","b","r","q","k"],f={white:{Q:"wQ",N:"wN",R:"wR",B:"wB"},black:{q:"bQ",n:"bN",r:"bR",b:"bB"}};for(var v in f.white)f.white[v]="/img/chesspieces/wikipedia/"+f.white[v]+".png";for(var p in f.black)f.black[p]="/img/chesspieces/wikipedia/"+f.black[p]+".png";var d={name:"Promotion",data:function(){return{}},props:["pos","color","board"],computed:{file:function(){return this.pos%8},urls:function(){return this.color===c?f.white:f.black},width:function(){return this.board.offsetWidth/8},offset:function(){return this.board.getBoundingClientRect().x+(this.file-1)*this.width}}},b={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"promotion",style:{left:t.offset+"px",width:t.width+"px"}},t._l(t.urls,function(e,n){return i("img",{key:e,style:{width:t.width+"px"},attrs:{src:e},on:{click:function(e){t.$emit("done",n)}}})}))},staticRenderFns:[]};var m=i("VU/8")(d,b,!1,function(t){i("Y9hP")},"data-v-6968ab57",null).exports,g=i("KyXY"),k=i.n(g),w=(i("1MTY"),i("Xxa5")),_=i.n(w),P=i("exGp"),y=i.n(P),C=i("RRo+"),x=i.n(C),M=i("Zrlr"),N=i.n(M),R=i("wxAW"),S=i.n(R);function T(t){return t.charAt(0)===t.charAt(0).toUpperCase()}function A(t,e){return e===c?T(t):!T(t)}function Q(t,e){return T(t)===T(e)}function q(t){return t===c?u:c}function I(t,e){return Math.abs(t%8-e%8)}function B(t){return 8-Math.floor(t/8)}function K(t){if("number"==typeof t)return t;if(2!==t.length)return NaN;var e=(t=t.toLowerCase()).charCodeAt(0),i=t.charCodeAt(1),n="a".charCodeAt(0),r="h".charCodeAt(0);return e>=n&&e<=r&&i>=49&&i<=56?e-97+56-8*(i-49):NaN}function H(t){var e=String.fromCharCode(t%8+97),i=B(t).toString();return e.concat(i)}function E(t,e){for(var i=0;i<64;i++)if(t[i]!==e[i])return!1;return!0}var z={P:100,N:320,B:330,R:500,Q:900,K:3e4},F={P:[0,0,0,0,0,0,0,0,50,50,50,50,50,50,50,50,10,10,20,30,30,20,10,10,5,5,10,25,25,10,5,5,0,0,0,20,20,0,0,0,5,-5,-10,0,0,-10,-5,5,5,10,10,-20,-20,10,10,5,0,0,0,0,0,0,0,0],N:[-50,-40,-30,-30,-30,-30,-40,-50,-40,-20,0,0,0,0,-20,-40,-30,0,10,15,15,10,0,-30,-30,5,15,20,20,15,5,-30,-30,0,15,20,20,15,0,-30,-30,5,10,15,15,10,5,-30,-40,-20,0,5,5,0,-20,-40,-50,-40,-30,-30,-30,-30,-40,-50],B:[-20,-10,-10,-10,-10,-10,-10,-20,-10,0,0,0,0,0,0,-10,-10,0,5,10,10,5,0,-10,-10,5,5,10,10,5,5,-10,-10,0,10,10,10,10,0,-10,-10,10,10,10,10,10,10,-10,-10,5,0,0,0,0,5,-10,-20,-10,-10,-10,-10,-10,-10,-20],R:[0,0,0,0,0,0,0,0,5,10,10,10,10,10,10,5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,0,0,0,5,5,0,0,0],Q:[-20,-10,-10,-5,-5,-10,-10,-20,-10,0,0,0,0,0,0,-10,-10,0,5,5,5,5,0,-10,-5,0,5,5,5,5,0,-5,0,0,5,5,5,5,0,-5,-10,5,5,5,5,5,0,-10,-10,0,5,0,0,0,0,-10,-20,-10,-10,-5,-5,-10,-10,-20],K:[-30,-40,-40,-50,-50,-40,-40,-30,-30,-40,-40,-50,-50,-40,-40,-30,-30,-40,-40,-50,-50,-40,-40,-30,-30,-40,-40,-50,-50,-40,-40,-30,-20,-30,-30,-40,-40,-30,-30,-20,-10,-20,-20,-20,-20,-20,-20,-10,20,20,0,0,0,0,20,20,20,30,10,0,0,10,30,20]},D={},$=function(t){var e=t.toLowerCase();D[t]=[],D[e]=[],F[t].forEach(function(i,n){D[t].push(i+z[t]),D[e][56-n+n%8*2]=i+z[t]})};for(var U in F)$(U);function j(t){for(var e=0,i=0;i<64;i++)if(t[i]){var n=t[i];T(n)?e+=D[n][i]:e-=D[n][i]}return e}var L=i("ifoU"),Y=i.n(L),O=i("LtXW"),W=new O(O.engines.mt19937().seed(27102));function G(){return W.integer(-Math.pow(2,31),Math.pow(2,31)-1)}var V=function(){return[G(),G()]},X={};l.forEach(function(t){X[t]=[];for(var e=0;e<64;e++)X[t].push(V());X.turn=V(),X.wc=[V(),V()],X.bc=[V(),V()],X.epFile=[];for(var i=0;i<8;i++)X.epFile.push(V());X.kp=[];for(var n=[3,5,59,61],r=0;r<n.length;r++)X.kp[n[r]]=V()});!function(){function t(e){N()(this,t),this.map=new Y.a,this.maxSize=e}S()(t,[{key:"size",value:function(){return this.map.size}},{key:"get",value:function(t){var e=t[0],i=t[1],n=this.map.get(e);if(void 0!==n)return this.map.delete(e),this.map.set(e,n),n[i]}},{key:"add",value:function(t,e){var i=t[0],n=t[1],r=this.map.get(i);if(void 0!==r)r[n]=e,this.map.delete(i),this.map.set(i,r);else{var s=[];s[n]=e,this.map.set(i,s)}return this.map.size>this.maxSize&&this.map.delete(this.map.keys().next().value),e}},{key:"clear",value:function(){this.map.clear()}},{key:"setSize",value:function(t){this.maxSize=t}}])}();var J=function(){function t(e){N()(this,t),this.cache=[],this.currentSize=0,this.maxSize=e}return S()(t,[{key:"size",value:function(){return this.currentSize}},{key:"setSize",value:function(t){this.maxSize=t}},{key:"get",value:function(t){var e=t[0],i=t[1];return void 0!==this.cache[e]?this.cache[e][i]:void 0}},{key:"add",value:function(t,e){var i=t[0],n=t[1];return this.currentSize===this.maxSize&&(this.cache=[],this.currentSize=0),void 0!==this.cache[i]?(void 0===this.cache[i][n]&&this.currentSize++,this.cache[i][n]=e):(this.cache[i]=[],this.cache[i][n]=e,this.currentSize++),e}},{key:"clear",value:function(){this.cache=[],this.currentSize=0}}]),t}(),Z=56,tt=7,et=-8,it=-1,nt={};for(var rt in nt.P=[et,-16,-9,-7],nt.N=[-17,-15,-10,6,17,15,-6,10],nt.B=[-9,-7,7,9],nt.R=[et,1,8,it],nt.Q=[et,-7,1,9,8,7,it,-9],nt.K=[et,-7,1,9,8,7,it,-9],nt)nt[rt.toLowerCase()]=nt[rt];nt.p=[];for(var st=0;st<nt.P.length;st++)nt.p.push(-nt.P[st]);var at=function(){function t(e){var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:c,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:[!0,!0],r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:[!0,!0],s=arguments.length>4&&void 0!==arguments[4]?arguments[4]:-1,a=arguments.length>5&&void 0!==arguments[5]?arguments[5]:-1,o=arguments.length>6&&void 0!==arguments[6]?arguments[6]:0,h=arguments[7],l=arguments[8],f=arguments[9];if(N()(this,t),"string"==typeof e){var v=e;this.board=[],this.wc=[!1,!1],this.bc=[!1,!1],this.ep=-1,this.kp=-1;for(var p=v.trim().split(/ +/),d=0,b=0;b<p[0].length;){var m=p[0].charAt(b),g=parseInt(m);if(x()(g)){for(var k=0;k<g;k++)this.board[d+k]=null;d+=g}else m=m,this.board[d]=m,d++;if(b++,d>=64)break;d%8==0&&b++}switch(p[1]){case"w":this.turn=c;break;case"b":this.turn=u;break;default:throw new Error("Invalid fen string")}if("-"!==p[2])for(var w=[],_=0;_<p[2].length;_++){var P=p[2].charAt(_);switch(P){case"Q":this.wc[0]=!0;break;case"K":this.wc[1]=!0;break;case"q":this.bc[1]=!0;break;case"k":this.bc[0]=!0;break;default:throw new Error("Invalid fen string")}w.push(P)}"-"!==p[3]&&(this.ep=K(p[3])),this.halfMoveClock=parseInt(p[4])}else this.board=e,this.turn=i,this.wc=n,this.bc=r,this.ep=s,this.kp=a,this.halfMoveClock=void 0!==o?o:0;this.score=void 0!==h?h:this.turn===c?j(this.board):-j(this.board),this.hash=void 0!==l?l:function(t){var e=[0,0],i=function(t){e[0]^=t[0],e[1]^=t[1]};t.turn===c&&i(X.turn);for(var n=0;n<64;n++){var r=t.board[n];r&&i(X[r][n])}return t.wc[0]&&i(X.wc[0]),t.wc[1]&&i(X.wc[1]),t.bc[0]&&i(X.bc[0]),t.bc[1]&&i(X.bc[1]),-1!==t.ep&&i(X.epFile[t.ep%8]),-1!==t.kp&&i(X.kp[t.kp]),e}(this),this.boardHash=void 0!==f?f:this.hashBoard()}return S()(t,[{key:"genMoves",value:_.a.mark(function t(){var e,i,n,r,s,a,o,h=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.turn;return _.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:e=0;case 1:if(!(e<this.board.length)){t.next=48;break}if(null!==(i=this.board[e])&&A(i,h)){t.next=5;break}return t.abrupt("continue",45);case 5:if("K"!==i.toUpperCase()){t.next=13;break}if(!(n=h===c?this.wc:this.bc)[0]||null!==this.board[e-1]||null!==this.board[e-2]){t.next=10;break}return t.next=10,[e,e-2];case 10:if(!n[1]||null!==this.board[e+1]||null!==this.board[e+2]){t.next=13;break}return t.next=13,[e,e+2];case 13:r=0;case 14:if(!(r<nt[i].length)){t.next=45;break}if(!(-16===(s=nt[i][r])&&e<Z-8||16===s&&e>tt+8)){t.next=18;break}return t.abrupt("continue",42);case 18:a=e+s;case 19:if(!(a>=0&&a<=63&&I(a,a-s)<6)){t.next=42;break}if(o=this.board[a],"P"!==i.toUpperCase()){t.next=30;break}if(0!==I(e,a)||null===o){t.next=24;break}return t.abrupt("break",42);case 24:if(2!==(u=e,l=a,Math.abs(Math.floor(u/8)-Math.floor(l/8)))||null===this.board[e+s/2]){t.next=26;break}return t.abrupt("break",42);case 26:if(1!==I(e,a)||a===this.ep||null!==o&&!Q(o,i)){t.next=28;break}return t.abrupt("break",42);case 28:t.next=35;break;case 30:if(null===o){t.next=35;break}if(Q(o,i)){t.next=34;break}return t.next=34,[e,a];case 34:return t.abrupt("break",42);case 35:return t.next=37,[e,a];case 37:if(!"KkNnPp".includes(i)){t.next=39;break}return t.abrupt("break",42);case 39:a+=s,t.next=19;break;case 42:r++,t.next=14;break;case 45:e++,t.next=1;break;case 48:case"end":return t.stop()}var u,l},t,this)})},{key:"nullMove",value:function(){return new t(this.board.slice(),q(this.turn),this.wc,this.bc,-1,-1,this.halfMoveClock+1,-this.score,this.hashNullMove(),this.boardHash)}},{key:"move",value:function(e,i,n){var r=e[0],s=e[1],a=this.board[r];i||(i=this.turn===c?"Q":"q");var o=this.board.slice(),h=this.wc.slice(),u=this.bc.slice(),l=-1,f=-1;void 0===n&&(n=-(this.score+this.value(e,i)));var v=void 0;if(v=o[s]?0:this.halfMoveClock+1,o[s]=o[r],o[r]=null,"K"===a)h=[!1,!1],2===Math.abs(s-r)&&(o[f=(r+s)/2]="R",o[s<r?Z:63]=null);else if("k"===a)u=[!1,!1],2===Math.abs(s-r)&&(o[f=(r+s)/2]="r",o[s<r?0:tt]=null);else{var p=function(t){switch(t){case Z:h[0]=!1;break;case 63:h[1]=!1;break;case 0:u[0]=!1;break;case tt:u[1]=!1}};p(r),p(s),"P"===a?(v=0,s-r==-16?l=(s+r)/2:s===this.ep?o[s+8]=null:s<=tt&&(o[s]=i)):"p"===a&&(v=0,s-r==16?l=(s+r)/2:s===this.ep?o[s-8]=null:s>=Z&&(o[s]=i))}var d=this.hashMove(e,i);return new t(o,q(this.turn),h,u,l,f,v,n,d[0],d[1])}},{key:"value",value:function(t,e){var i=t[0],n=t[1],r=this.board[i],s=this.board[n];if(-1!==this.kp&&Math.abs(n-this.kp)<2)return 3e4;var a=D[r][n]-D[r][i];return s&&(a+=D[s][n]),"K"===r&&2===Math.abs(n-i)?(a+=D.R[(n+i)/2],a-=n<i?D.R[Z]:D.R[63]):"k"===r&&2===Math.abs(n-i)&&(a+=D.r[(n+i)/2],a-=n<i?D.r[0]:D.r[tt]),"P"===r?n<=tt?a+=D[e||"Q"][n]-D[r][n]:n===this.ep&&(s=this.board[n+8],a+=D[s][n+8]):"p"===r&&(n>=Z?a+=D[e||"q"][n]-D[r][n]:n===this.ep&&(s=this.board[n-8],a+=D[s][n-8])),a}},{key:"hashMove",value:function(t,e){var i=this,n=t[0],r=t[1],s=this.board[n],a=this.board[r],o=this.hash.slice(),h=this.boardHash.slice(),c=function(t){o[0]^=t[0],o[1]^=t[1]},u=function(t){h[0]^=t[0],h[1]^=t[1]};if(c(X.turn),-1!==this.ep&&c(X.epFile[this.ep%8]),-1!==this.kp&&c(X.kp[this.kp]),c(X[s][n]),c(X[s][r]),u(X[s][n]),u(X[s][r]),a&&(c(X[a][r]),u(X[a][r])),"K"===s&&2===Math.abs(r-n)){var l=(r+n)/2;c(X.wc[0]),c(X.wc[1]),c(X.kp[l]),c(X.R[l]),u(X.R[l]),r<n?(c(X.R[Z]),u(X.R[Z])):(c(X.R[63]),u(X.R[63]))}else if("k"===s&&2===Math.abs(r-n)){var f=(r+n)/2;c(X.bc[0]),c(X.bc[1]),c(X.kp[f]),c(X.r[f]),u(X.r[f]),r<n?(c(X.r[0]),u(X.r[0])):(c(X.r[tt]),u(X.r[tt]))}else{var v=function(t){switch(t){case Z:i.wc[0]&&c(X.wc[0]);break;case 63:i.wc[1]&&c(X.wc[1]);break;case 0:i.bc[0]&&c(X.bc[0]);break;case tt:i.bc[1]&&c(X.bc[1])}};v(n),v(r),"P"===s?r-n==-16?c(X.epFile[(r+n)/2%8]):r===this.ep?(a=this.board[r+8],c(X[a][r+8]),u(X[a][r+8])):r<=tt&&(c(X[s][r]),c(X[e||"Q"][r]),u(X[s][r]),u(X[e||"Q"][r])):"p"===s&&(r-n==16?c(X.epFile[(r+n)/2%8]):r===this.ep?(a=this.board[r-8],c(X[a][r-8]),u(X[a][r-8])):r>=Z&&(c(X[s][r]),c(X[e||"q"][r]),u(X[s][r]),u(X[e||"q"][r])))}return[o,h]}},{key:"hashNullMove",value:function(){var t=this.hash.slice(),e=function(e){t[0]^=e[0],t[1]^=e[1]};return-1!==this.ep&&e(X.epFile[this.ep%8]),-1!==this.kp&&e(X.kp[this.kp]),e(X.turn),t}},{key:"hashBoard",value:function(){for(var t=[0,0],e=0;e<64;e++){var i=this.board[e];i&&(t[0]^=X[i][e][0],t[1]^=X[i][e][1])}return t}},{key:"valid",value:function(t){for(var e=this.genMoves(),i=e.next();!i.done;){if(t[0]===i.value[0]&&t[1]===i.value[1]){for(var n=this.move(t),r=n.genMoves(),s=r.next();!s.done;){if(-1!==n.kp&&Math.abs(s.value[1]-n.kp)<2)return!1;var a=n.board[s.value[1]];if(null!==a&&"Kk".includes(a))return!1;s=r.next()}return!0}i=e.next()}return!1}},{key:"inCheck",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.turn,e=void 0,i=void 0,n=void 0,r=void 0;for(var s in t===c?(r=this.board.indexOf("K"),e={bq:nt.B,rq:nt.R,n:nt.N},n="p",i=[7,9]):(r=this.board.indexOf("k"),e={BQ:nt.B,RQ:nt.R,N:nt.N},n="P",i=[-9,-7]),e)for(var a=0;a<e[s].length;a++)for(var o=r+e[s][a];o>=0&&o<=63&&I(o,o-e[s][a])<6;){if(this.board[o]){if(s.includes(this.board[o]))return!0;if(this.board[o]===n&&(r===o+i[0]||r===o+i[1]))return!0;break}if("Nn".includes(s))break;o+=e[s][a]}return!1}},{key:"toString",value:function(){for(var t="",e=0,i=0;i<64;i++)null===this.board[i]?e++:(e>0&&(t+=e,e=0),t+=this.board[i]),i%8==7&&(e>0&&(t+=e,e=0),i<63&&(t+="/"));return t+=" ",this.turn===c?t+="w":t+="b",t+=" ",this.wc[0]||this.wc[1]||this.bc[0]||this.bc[1]?(this.wc[1]&&(t+="K"),this.wc[0]&&(t+="Q"),this.bc[1]&&(t+="k"),this.bc[0]&&(t+="q")):t+="-",t+=" ",-1!==this.ep?t+=H(this.ep):t+="-",t+=" ",t+=this.halfMoveClock,t+=" ",t+=1}}]),t}(),ot=i("woOf"),ht=i.n(ot),ct=15*z.Q,ut=50,lt="L",ft="E",vt="H",pt=new J(1e7),dt=new J(1e3);dt.push=function(t){var e=this.get(t);void 0!==e?this.add(t,e+1):this.add(t,1)},dt.pull=function(t){var e=this.get(t);void 0!==e&&e>0&&this.add(t,e-1)};!function(){function t(){return N()(this,t),this.origins={},this}S()(t,[{key:"add",value:function(t){this.origins[t[0]]?this.origins[t[0]][t[1]]=!0:(this.origins[t[0]]={},this.origins[t[0]][t[1]]=!0)}},{key:"forEach",value:function(t,e){for(var i in this.origins)for(var n in this.origins[i]);}}])}();var bt=0,mt=0,gt=void 0,kt=!1,wt=function(){return Date.now()>gt&&kt};function _t(t,e,i){if(e){var n=e[0],r=void 0;if(r=n[1]===t.ep?"P"===t.board[n[0]]?t.board[t.ep+8]:"p"===t.board[n[0]]?t.board[t.ep-8]:t.board[n[1]]:t.board[n[1]],i(e[0],e[1],r))return}var s=t.genMoves(),a=s.next();if(!a.done)for(;!a.done;){var o=a.value,h=void 0;if(h=o[1]===t.ep?"P"===t.board[o[0]]?t.board[t.ep+8]:t.board[t.ep-8]:t.board[o[1]],"P"===t.board[o[0]]&&o[1]<=tt){for(var c=0;c<"QNRB".length;c++)if(i(o,"QNRB".charAt(c),h))return}else if("p"===t.board[o[0]]&&o[1]>=Z){for(var u=0;u<"qnrb".length;u++)if(i(o,"qnrb".charAt(u),h))return}else if(i(o,void 0,h))return;a=s.next()}}function Pt(t){for(var e=t.genMoves(),i=e.next();!i.done;)if("Kk".includes(t.board[i.value[0]])&&2===Math.abs(i.value[1]-i.value[0]))i=e.next();else{if(!t.move(i.value).inCheck(t.turn))return!1;i=e.next()}return!0}function yt(t){var e={};l.forEach(function(t){e[t]=0});for(var i=0;i<64;i++){var n=t.board[i];n&&e[n]++}return e.new=function(t){var e=ht()({},this);return t&&e[t]--,e},e.endgame=function(){return!(this.Q>0&&(this.R>0||this.B+this.N>1))&&!(this.q>0&&(this.r>0||this.b+this.n>1))},e.insufficientMaterial=function(){return 0===this.Q&&0===this.q&&0===this.P&&0===this.p&&0===this.R&&0===this.r&&(0===this.B||1===this.B&&0===this.N)&&(0===this.b||1===this.b&&0===this.n)},e}function Ct(t,e,i,n,r){var s=arguments.length>5&&void 0!==arguments[5]&&arguments[5];if(mt++,t.halfMoveClock>=50)return 0;if(dt.get(t.boardHash)>=3)return 0;var a=!0,o=void 0,h=pt.get(t.hash);if(h&&(o=h.pv,h.depth>=e))switch(bt++,h.fail){case lt:if(h.score<=i)return i;break;case ft:return h.score;case vt:if(h.score>=n)return n}h=pt.add(t.hash,{pv:o,score:i,depth:e,fail:lt});var c=r.endgame();if(c&&r.insufficientMaterial())return h.score=0,h.fail=ft,0;var u=function(t,e,r){if(wt())return!0;if(r>i){if(r>=ct)return i=ct,h.fail=vt,!0;if(a=!1,h.pv=[t,e],r>=n)return i=n,h.fail=vt,!0;i=r,h.fail=ft}else r>-ct&&(a=!1);return!1};if(e<=0)if(t.score>=n){if(!t.inCheck())return c&&Pt(t)?(h.score=0,h.fail=ft,0):(h.score=n,h.fail=vt,n);a=!1,_t(t,o,function(s,a,o){var h=t.move(s,a);if(h.inCheck(t.turn))return!1;dt.push(h.boardHash);var c=-Ct(h,e-1,-n,-i,r.new(o));return dt.pull(h.boardHash),u(s,a,c)})}else{if(t.score+z.Q<i)return t.inCheck(q(t.turn))?(h.fail=vt,h.score=ct,ct):c&&!t.inCheck()&&Pt(t)?(h.score=0,h.fail=ft,0):i;_t(t,o,function(s,a,o){if(-1!==t.kp&&Math.abs(t.kp-s[1])<2)return i=ct,h.fail=vt,!0;if(!(t.board[s[1]]||s[1]===t.ep&&"Pp".includes(t.board[s[0]])))return!1;var c=t.score+t.value(s,a);if(c>=ct)return i=ct,h.fail=vt,!0;if((t.board[s[1]]||s[1]===t.ep)&&c+2*z.P>=i){var l=t.move(s,a,-c);dt.push(l.boardHash);var f=-Ct(l,e-1,-n,-i,r.new(o));return dt.pull(l.boardHash),u(s,a,f)}return!1})}else{if(!s&&1===e&&t.score+z.Q<i)return t.inCheck(q(t.turn))?(h.score=ct,h.fail=vt,ct):c&&Pt(t)?(h.score=0,h.fail=ft,0):i;if(!s&&!c&&-Ct(t.nullMove(),e-3,-n,-i,r.new())>=n)return h.score=n,h.fail=vt,n;_t(t,o,function(s,a){var o=t.score+t.value(s,a);if(o>=ct)return i=ct,h.fail=vt,!0;if(1===e&&o+2*z.P<i)return!1;var c=t.move(s,a,-o);dt.push(c.boardHash);var l=-Ct(c,e-1,-n,-i,r.new());return dt.pull(c.boardHash),u(s,a,l)})}return a&&c&&!t.inCheck()&&Pt(t)?(h.score=0,h.fail=ft,0):(wt()&&(h.fail=vt),h.score=i,i)}function xt(t,e,i){var n={lower:-ct,upper:ct},r=void 0,s=i-2*ut,a=yt(t);do{(s=Ct(t,e,(r=n.lower!==-ct&&n.upper!==ct?n.upper-n.lower>3?Math.floor((n.lower+n.upper)/2):s+(s===n.lower?1:0):s===n.lower?s+ut:s===n.upper?s-ut:s)-1,r,a.new(),!0))<r?n.upper=s:(n.lower=s,kt=!0)}while(n.lower<=n.upper-1&&!wt());return s}var Mt=function(){var t=y()(_.a.mark(function t(e,i){var n,r,s,a,o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:5e3,h=arguments[3],c=arguments[4];return _.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:n=e.score,r=void 0,i.forEach(function(t){dt.push(new at(t.fen).boardHash)}),dt.push(e.boardHash),o<1e3&&(o=1e3),o>6e4&&(o=6e4),gt=Date.now()+o,h.searched=0,h.tpHits=0,s=1;case 10:if(!(s<100)||wt()){t.next=22;break}if(h.depth=s,!c){t.next=15;break}return t.next=15,c();case 15:s>1&&(r=pt.get(e.hash)),n=xt(e,s,n),s++,h.searched=mt,h.tpHits=bt,t.next=10;break;case 22:return kt=!1,mt=0,bt=0,a=pt.get(e.hash),(!r||a.score>r.score&&a.fail!==lt)&&(r=a),console.log("searched: "+h.searched),console.log("hits: "+h.tpHits+"\n"),pt.clear(),dt.clear(),t.abrupt("return",r.pv);case 32:case"end":return t.stop()}},t,this)}));return function(e,i){return t.apply(this,arguments)}}(),Nt={startPos:"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",searchTime:4},Rt=function(){function t(e){N()(this,t),this.config=Nt,this.history=[],this.aiInfo={depth:0,searched:0,tpHits:0},e&&this.configure(e),this.setPos(this.config.startPos)}return S()(t,[{key:"configure",value:function(t){for(var e in t)this.config[e]=t[e]}},{key:"getConfig",value:function(){return this.config}},{key:"setPos",value:function(t){var e,i,n=[],r=void 0,s=[!1,!1],a=[!1,!1],o=-1,h=t.trim().split(/ +/);if(6!==h.length)return!1;for(var f=0,v=0;v<h[0].length;){var p=h[0].charAt(v),d=parseInt(p);if(x()(d)&&d>0){if(d>8-f%8)return!1;for(var b=0;b<d;b++)n[f+b]=null;f+=d}else{if(!l.includes(p))return!1;p=p,n[f]=p,f++}if(v++,f>=64)break;if(f%8==0){if("/"!==h[0].charAt(v))return!1;v++}}if(" "!==t.charAt(v))return!1;switch(h[1]){case"w":r=c;break;case"b":r=u;break;default:return!1}if("-"!==h[2]){if(h[2].length>4)return!1;for(var m=[],g=0;g<h[2].length;g++){var k=h[2].charAt(g);if(m.includes(k))return!1;switch(k){case"Q":s[0]=!0;break;case"K":s[1]=!0;break;case"q":a[1]=!0;break;case"k":a[0]=!0;break;default:return!1}m.push(k)}}if("-"!==h[3]){var w=B(o=K(h[3]));if(isNaN(o))return!1;if(3!==w&&6!==w)return!1}return e=parseInt(h[4]),i=parseInt(h[5]),!!(x()(e)&&e>=0)&&(!!(x()(i)&&i>0)&&(this.fullMove=i,this.position=new at(n,r,s,a,o,-1,e),this.history=[],!0))}},{key:"fen",value:function(){for(var t=this.position,e=t.board,i="",n=0,r=0;r<64;r++)null===e[r]?n++:(n>0&&(i+=n,n=0),i+=e[r]),r%8==7&&(n>0&&(i+=n,n=0),r<63&&(i+="/"));return i+=" ",t.turn===c?i+="w":i+="b",i+=" ",t.wc[0]||t.wc[1]||t.bc[0]||t.bc[1]?(t.wc[1]&&(i+="K"),t.wc[0]&&(i+="Q"),t.bc[1]&&(i+="k"),t.bc[0]&&(i+="q")):i+="-",i+=" ",-1!==t.ep?i+=H(t.ep):i+="-",i+=" ",i+=t.halfMoveClock,i+=" ",i+=this.fullMove,i}},{key:"move",value:function(t,e,i){if(t=K(t),e=K(e),i)if(this.position.turn===c){if(!"QNRB".includes(i))return!1}else if(!"qnrb".includes(i))return!1;return!!this.valid(t,e)&&(this.history.push({fen:this.fen(),move:[t,e]}),this.position=this.position.move([t,e],i),this.position.turn===c&&(this.fullMove+=1),!0)}},{key:"undoMove",value:function(){var t=this.history,e=t.pop();return e?(this.setPos(e.fen),this.history=t,e.move):null}},{key:"winner",value:function(){return this.inCheckMate()?this.position.turn===c?"black":"white":this.fiftyMoves()||this.inThreefoldRepetition()||this.inStaleMate()||this.insuffMaterial()?"draw":null}},{key:"insuffMaterial",value:function(){return yt(this.position).insufficientMaterial()}},{key:"fiftyMoves",value:function(){return this.position.halfMoveClock>=50}},{key:"inThreefoldRepetition",value:function(){for(var e=1,i=0;i<this.history.length;i++){var n=new t;if(n.setPos(this.history[i].fen),E(n.position.board,this.position.board)&&3===++e)return!0}return!1}},{key:"inCheckMate",value:function(){return 0===this.moves().length&&this.position.inCheck()}},{key:"inStaleMate",value:function(){return 0===this.moves().length&&!this.position.inCheck()}},{key:"moves",value:function(){for(var t=[],e=this.position.genMoves(),i=e.next();!i.done;)this.position.valid(i.value)&&t.push(i.value),i=e.next();return t}},{key:"valid",value:function(t,e){return t=K(t),e=K(e),this.position.valid([t,e])}},{key:"restart",value:function(){this.setPos(this.config.startPos)}},{key:"aiMove",value:function(){var t=y()(_.a.mark(function t(){var e;return _.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:if(null===this.winner()){t.next=2;break}return t.abrupt("return");case 2:return t.next=4,Mt(this.position,this.history,1e3*this.config.searchTime,this.aiInfo,this.config.betweenDepths);case 4:if(!(e=t.sent)){t.next=10;break}return this.move(e[0][0],e[0][1],e[1]),t.abrupt("return",e);case 10:throw new Error("The AI failed to make a move");case 11:case"end":return t.stop()}},t,this)}));return function(){return t.apply(this,arguments)}}()},{key:"turn",value:function(){return this.position.turn===c?"white":"black"}}]),t}(),St=new Rt,Tt=new Rt,At={name:"Home",components:{Promotion:m},data:function(){return{game:St,promotion:null,winner:St.winner(),aiInfo:St.aiInfo,fen:St.fen(),startPos:St.config.startPos}},computed:{invalidFen:function(){return!Tt.setPos(this.fen)},invalidStartPos:function(){return!Tt.setPos(this.startPos)}},watch:{"game.position.board":function(){this.board.position(this.game.fen(),!1),this.winner=this.game.winner(),this.fen=this.game.fen()},"game.position.turn":function(){var t=this;"black"===this.game.turn()&&null===this.game.winner()&&setTimeout(function(){return t.game.aiMove(5e3)},100)},"game.aiInfo":{handler:function(t){this.aiInfo=t},deep:!0}},mounted:function(){var t=this;this.game.configure({betweenDepths:function(){return new h.a(function(t){return setTimeout(t,10)})}});this.board=k()("board",{position:this.game.fen(),draggable:!0,onDrop:function(e,i,n){if(!t.game.valid(e,i))return"snapback";var r=B(K(i));if("P"!==n.charAt(1)||8!==r&&1!==r)t.game.move(e,i);else{var s="w"===n.charAt(0)?c:u;t.promotion={pos:K(i),color:s,src:e,target:i}}},onDragStart:function(e,i){return("w"===i.charAt(0)?c:u)===t.game.position.turn&&null===t.winner}})},methods:{handlePromotion:function(t){this.game.move(this.promotion.src,this.promotion.target,t),this.promotion=null},cancel:function(){this.promotion=null,this.board.position(this.game.fen(),!1)},undoMove:function(){this.game.undoMove(),St.position.turn===u&&this.game.undoMove()},restart:function(){this.game.restart()},setPos:function(){this.game.setPos(this.fen)&&(this.fen=this.game.fen())},setStartPos:function(){Tt.setPos(this.startPos)&&this.game.configure({startPos:this.startPos})},resetStartPos:function(){this.game.configure({startPos:"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"}),this.startPos=this.game.config.startPos},setTime:function(t){this.game.configure({searchTime:t})}}},Qt={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[i("h1",[t._v("Jackfish")]),t._v(" "),i("h2",[t._v("A chess engine in javascript.")]),t._v(" "),i("div",{staticClass:"game-status"},["white"===t.winner?i("h3",[t._v("The winner is\n      "),i("span",{staticClass:"white"},[t._v("white")])]):"black"===t.winner?i("h3",[t._v("The winner is\n      "),i("span",{staticClass:"black"},[t._v("black")])]):"draw"===t.winner?i("h3",[t._v("It's a draw")]):i("h3",{style:{visibility:"hidden"}},[t._v("\n      Game is still running.\n    ")]),t._v(" "),i("button",{staticClass:"btn btn-light",attrs:{type:"button"},on:{click:t.undoMove}},[t._v("\n      Undo move\n    ")]),t._v(" "),i("button",{staticClass:"btn btn-light",attrs:{type:"button"},on:{click:t.restart}},[t._v("\n      Restart\n    ")]),t._v(" "),i("div",{staticClass:"mt-3"},[i("h6",[t._v("AI search time")]),t._v(" "),i("div",{staticClass:"mb-2"},[i("input",{directives:[{name:"model",rawName:"v-model",value:t.game.config.searchTime,expression:"game.config.searchTime"}],domProps:{value:t.game.config.searchTime},on:{input:function(e){e.target.composing||t.$set(t.game.config,"searchTime",e.target.value)}}})]),t._v(" "),i("button",{staticClass:"btn btn-outline-success",attrs:{type:"button"},on:{click:function(e){t.setTime(2)}}},[t._v("Easy")]),t._v(" "),i("button",{staticClass:"btn btn-outline-warning",attrs:{type:"button"},on:{click:function(e){t.setTime(4)}}},[t._v("Medium")]),t._v(" "),i("button",{staticClass:"btn btn-outline-danger",attrs:{type:"button"},on:{click:function(e){t.setTime(6)}}},[t._v("Danger")])]),t._v(" "),i("div",{staticClass:"mt-3"},[i("h6",[t._v("Fen of starting position.")]),t._v(" "),i("div",[i("input",{directives:[{name:"model",rawName:"v-model",value:t.startPos,expression:"startPos"}],staticClass:"fen",domProps:{value:t.startPos},on:{input:function(e){e.target.composing||(t.startPos=e.target.value)}}})]),t._v(" "),i("button",{staticClass:"btn btn-dark",on:{click:t.setStartPos}},[t._v("Set position")]),t._v(" "),i("button",{staticClass:"btn btn-dark",on:{click:t.resetStartPos}},[t._v("Reset")]),t._v(" "),t.invalidStartPos?i("p",{staticClass:"text-danger"},[t._v("Invalid FEN string")]):t._e()]),t._v(" "),i("div",{staticClass:"mt-3"},[t._m(0),t._v(" "),i("div",[i("input",{directives:[{name:"model",rawName:"v-model",value:t.fen,expression:"fen"}],staticClass:"fen",domProps:{value:t.fen},on:{input:function(e){e.target.composing||(t.fen=e.target.value)}}})]),t._v(" "),i("button",{staticClass:"btn btn-dark",on:{click:t.setPos}},[t._v("Set position")]),t._v(" "),t.invalidFen?i("p",{staticClass:"text-danger"},[t._v("Invalid FEN string")]):t._e()]),t._v(" "),i("div",{staticClass:"mt-3"},[i("p",[i("strong",[t._v("Depth:")]),t._v(" "+t._s(t.aiInfo.depth))]),t._v(" "),i("p",[i("strong",[t._v("Nodes searched:")]),t._v(" "+t._s(t.aiInfo.searched))]),t._v(" "),i("p",[i("strong",[t._v("Hits in transposition table:")]),t._v(" "+t._s(t.aiInfo.tpHits))])])]),t._v(" "),t.promotion?i("Promotion",{attrs:{pos:t.promotion.pos,board:t.$refs.board,color:t.promotion.color},on:{done:t.handlePromotion}}):t._e(),t._v(" "),i("div",{ref:"board",attrs:{id:"board"},on:{click:t.cancel}}),t._v(" "),t._m(1),t._v(" "),t._m(2),t._v(" "),i("p",{staticClass:"created-by"},[t._v("Created by Mattias Ahlsén")])],1)},staticRenderFns:[function(){var t=this.$createElement,e=this._self._c||t;return e("h6",[e("a",{attrs:{href:"https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation"}},[this._v("\n          FEN\n        ")]),this._v(" of board\n      ")])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"links"},[e("h3",[this._v("About")]),this._v(" "),e("p",[this._v('\n      This is a chess engine I\'ve built in javascript. The "AI" uses\n      '),e("a",{attrs:{href:"https://chessprogramming.wikispaces.com/MTD%28f%29"}},[this._v("mtd(f)")]),this._v(".\n      All rules apply: insufficient material, fifty-move rule, threefold\n      repetition etc, and the AI recognizes all these as draws and evaluates\n      them accordingly. See more below.\n    ")]),this._v(" "),e("a",{staticClass:"btn btn-primary btn-lg",attrs:{href:"https://github.com/mattiasahlsen/jackfish/",role:"button"}},[this._v("\n      Github repo\n    ")])])},function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"about mt-4 mb-4"},[i("h4",{staticClass:"mt-3"},[t._v("Features")]),t._v(" "),i("ul",{staticClass:"list-group"},[i("li",{staticClass:"list-group-item"},[i("a",{attrs:{href:"https://chessprogramming.wikispaces.com/Simplified+evaluation+function"}},[t._v("\n          Piece-square table evaluation\n        ")])]),t._v(" "),i("li",{staticClass:"list-group-item"},[i("a",{attrs:{href:"https://chessprogramming.wikispaces.com/MTD%28f%29"}},[t._v("\n          MTD(f)\n        ")])]),t._v(" "),i("li",{staticClass:"list-group-item"},[i("a",{attrs:{href:"https://chessprogramming.wikispaces.com/Alpha-Beta"}},[t._v("\n          Alpha-beta\n        ")])]),t._v(" "),i("li",{staticClass:"list-group-item"},[i("a",{attrs:{href:"https://chessprogramming.wikispaces.com/Iterative+Deepening"}},[t._v("\n          Iterative deepening\n        ")])]),t._v(" "),i("li",{staticClass:"list-group-item"},[i("a",{attrs:{href:"https://chessprogramming.wikispaces.com/Transposition%20Table#KeyCollisions"}},[t._v("\n          Transposition table\n        ")])]),t._v(" "),i("li",{staticClass:"list-group-item"},[i("a",{attrs:{href:"https://chessprogramming.wikispaces.com/Quiescence+Search"}},[t._v("\n          Quiescence search\n        ")])]),i("li",{staticClass:"list-group-item"},[i("a",{attrs:{href:"https://chessprogramming.wikispaces.com/delta+pruning"}},[t._v("\n          Delta pruning\n        ")])])]),t._v(" "),i("h4",{staticClass:"mt-3"},[t._v("To be implemented")]),t._v(" "),i("ul",{staticClass:"list-group"},[i("li",{staticClass:"list-group-item"},[i("a",{attrs:{href:"https://chessprogramming.wikispaces.com/Killer+Move"}},[t._v("\n          Killer heuristic\n        ")])]),t._v(" "),i("li",{staticClass:"list-group-item"},[i("a",{attrs:{href:"https://chessprogramming.wikispaces.com/Pawn%20Structure"}},[t._v("\n          Pawn structure evaluation\n        ")])])]),t._v(" "),i("h4",{staticClass:"mt-3"},[t._v("Credits to")]),t._v(" "),i("a",{attrs:{href:"https://chessprogramming.wikispaces.com/"}},[t._v("https://chessprogramming.wikispaces.com/")]),t._v(" "),i("br"),t._v(" "),i("a",{attrs:{href:"https://github.com/thomasahle/sunfish"}},[t._v("https://github.com/thomasahle/sunfish")])])}]};var qt=i("VU/8")(At,Qt,!1,function(t){i("8Tgm")},"data-v-72d8cf48",null).exports;n.a.use(a.a);var It=new a.a({routes:[{path:"/",name:"Home",component:qt}]}),Bt=i("7t+N"),Kt=i.n(Bt);i("qb6w");window.$=window.jquery=Kt.a,n.a.config.productionTip=!1,new n.a({el:"#app",router:It,components:{App:s},template:"<App/>"})},Y9hP:function(t,e){},gsu9:function(t,e){},qb6w:function(t,e){}},["NHnr"]);
//# sourceMappingURL=app.3c9b3f545b10f3ec7cae.js.map