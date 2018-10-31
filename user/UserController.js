// UserController.js
var express = require('express');
var router = express.Router();//Se usa para crear un subconjunto de rutas
var bodyParser = require('body-parser');
const fetch = require('node-fetch');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var User = require('./User');

    /*var obj = req.body.noticia;{url:'https://diariohoy.net',
           xpath:"body/div[1]/div[1]/div[1]/div[2]/section[1]/article[1]/a[1]/h2[1]",
           category:"Politica"
          };*/  
//var userId ='amzn1.ask.account.AEM7C7O3S3FKO4J77F7YYBP5CXPUVG4VHEW4MM77YUETWFCQAMJE4PTXRJCZAJTWC2FKIP3MEVBILLNA2TK7VDHVBHBDA7ZSFLFRYWYE2U4WBV64CWFAKL74DHSBJ3KHY2VPD6HY7G5AWN5XUUIQCJYOQ3VAMD32MKA63PW5ZEDG5F2AXOIL5VNSGPKZZDY3IFDK4V75RD4CKYY';

router.get('/prueba',function(req,res){
  const fetch = require('node-fetch');
  //No devuelve el titulo en washingtonTimes
  var body = '   <!doctype html>  '  + 
 '   <html lang="es">  '  + 
 '   <head>  '  + 
 '   <title>Estudiantes - Cielosports</title>  '  + 
 '   <base href="https://infocielo.com/deportes/">  '  + 
 '   <link rel="shortcut icon" href="./images/favicon.png" type="image/png">  '  + 
 '   <link rel="apple-touch-icon" href="./images/apple-touch-icon.png">  '  + 
 '   <meta name="google-site-verification" content="jzeTZobLJPNQZJFfTQ3QdWOy8TRvwV-jI0jwBIeXbzU" />  '  + 
 '   <meta name="twitter:site" content="@INFOCIELO">  '  + 
 '   <meta name="twitter:creator" content="@INFOCIELO">  '  + 
 '   <meta name="geo.region" content="AR-B" />  '  + 
 '   <meta name="geo.placename" content="La Plata" />  '  + 
 '   <meta name="geo.position" content="-34.920495;-57.953566" />  '  + 
 '   <meta name="ICBM" content="-34.920495, -57.953566" />  '  + 
 '   <meta charset="utf-8">  '  + 
 '   <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">  '  + 
 '   <meta name="viewport" content="width=device-width , initial-scale=1">  '  + 
 '   <meta name="format-detection" content="telephone=no">  '  + 
 '   <meta name="generator" content="VorkNews" />  '  + 
 '   <meta name="robots" content="index, follow" />  '  + 
 '   <meta name="keywords" content="portal noticias políticas de la provincia de buenos aires, buenos aires, noticias la plata, infocielo, noticias de maria eugenia vidal, gobernadora buenos aires, scioli, política buenos aires">  '  + 
 '   <meta name="description" content="">  '  + 
 '   <meta name="title" content="Estudiantes - Cielosports">  '  + 
 '   <meta property="fb:pages" content="131158367038835">  '  + 
 '   <meta property="fb:page_id" content="131158367038835">  '  + 
 '   <meta property="og:type" content="website" />  '  + 
 '   <link rel="author" href="./humans.txt" />  '  + 
 '   <link rel="stylesheet" href="./style/style.css?=123">  '  + 
 '   <style>  '  + 
 '   .ffalt.bold, .ffalt .bold{ font-weight: 700; font-smooth: auto; }  '  + 
 '   </style>  '  + 
 '   <!--[if lt IE 9]>  '  + 
 '    <script src="./js/html5shiv/html5shiv.js"></script>   '  + 
 '    <![endif]-->  '  + 
 '   <link rel="stylesheet" href="./style/Font-Awesome-master/css/font-awesome.css">  '  + 
 '   <script src="//code.jquery.com/jquery-1.11.3.min.js"></script>  '  + 
 '   <script src="//code.jquery.com/jquery-migrate-1.2.1.min.js"></script>  '  + 
 '     '  + 
 '   <script>  '  + 
 '    !function(f,b,e,v,n,t,s)  '  + 
 '    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?  '  + 
 '    n.callMethod.apply(n,arguments):n.queue.push(arguments)};  '  + 
 '    n.queue=[];t=b.createElement(e);t.async=!0;  '  + 
 '    t.src=v;s=b.getElementsByTagName(e)[0];  '  + 
 '    </script>  '  + 
 '   <noscript>  '  + 
 '     <img height="1" width="1"  '  + 
 '    src="https://www.facebook.com/tr?id=1415188001934902&ev=PageView  '  + 
 '    &noscript=1"/>  '  + 
 '    </noscript>  '  + 
 '     '  + 
 '   </head>  '  + 
 '     '  + 
 '   <body class="estudiantes seccion bgbody arial">  '  + 
 '   <header class="auto boxed bgwhite">  '  + 
 '   <div class=" bgwhite ovh top-header">  '  + 
 '   <div class="pt10 pb10">  '  + 
 '   <div class="g6 fll mr ctext fz10 ffalt mt5">TODA LA INFO DEPORTIVA</div>  '  + 
 '   <div class="g6 fll tar">  '  + 
 '   <a href="../" class="dib mr10"><img src="./images/logo-infocielo-header.svg" alt=""></a>  '  + 
 '   <a href="http://cielofm.com/" target="_blank"><img src="./images/logo-cielofm-header.png" alt=""></a>  '  + 
 '   <a href="http://cielofm.com/reproductor" target="_blank" class="dib pr5 pl5 boton-radio-header ffalt fz10 cwhite ml10">ESCUCHALA EN VIVO</a>  '  + 
 '   </div>  '  + 
 '   <div class="clear"></div>  '  + 
 '   </div>  '  + 
 '   </div>  '  + 
 '   <div class="auto boxed bgheader pl10 pr10 ">  '  + 
 '   <div class="pt30 pb30 ovh">  '  + 
 '   <div class="g5 fll logo">  '  + 
 '   <a href="./">  '  + 
 '   <img src="./images/logo-cielosports.png" height="38" width="292" alt="">  '  + 
 '   </a>  '  + 
 '   <a href="http://cielofm.com/reproductor" target="_blank" class="ffalt bold fz12 cwhite bglink p2 dib pr10 pl10 ml10 dn estamos_al_aire">¡ESTAMOS AL AIRE!</a>  '  + 
 '   </div>  '  + 
 '   <div class="g2 fll tar ml mt5 arial fz11 cgris4 fecha lh16" style="width: 7.77%;">  '  + 
 '   <strong>Miércoles 31 <br></strong>  '  + 
 '   Octubre de 2018 </div>  '  + 
 '   <div class="g3 ml fll tar mt10 redes-sociales">  '  + 
 '   <a href="https://twitter.com/cielosports/" target="_blank" class="icon_social"><i class="fa fa-twitter"></i></a>  '  + 
 '   <a href="https://www.facebook.com/CieloSports" target="_blank" class="icon_social ml11"><i class="fa fa-facebook"></i></a>  '  + 
 '   <a href="https://www.instagram.com/cielosports/" target="_blank" class="icon_social ml11"><i class="fa fa-instagram"></i></a>  '  + 
 '   <a href="https://www.youtube.com/channel/UCF_mpxN6fe23SmwJ-C0i8GA" target="_blank" class="icon_social ml11"><i class="fa fa-youtube"></i></a>  '  + 
 '   </div>  '  + 
 '   <div class="flr g3 mt5 buscador">  '  + 
 '   <form action="./resultados" class="posr" id="form-buscador">  '  + 
 '   <input type="text" placeholder="Buscar" class="fz11 ffalt cgris4 p9" name="q"><a href="javascript:;" class="posa top right mr4 mt4 ctext" id="boton-buscador"><i class="fa fa-search cgris4"></i></a>  '  + 
 '   </form>  '  + 
 '   <script src="./js/vorkform/vorkform.js"></script>  '  + 
 '   <script>  '  + 
 '        $(function() {  '  + 
 '          $("#form-buscador").vorkForm({  '  + 
 '            sendMethod:   "submit",                       submitButton: "#boton-buscador",        });  '  + 
 '        });  '  + 
 '        </script>  '  + 
 '   </div>  '  + 
 '   </div>  '  + 
 '   </div>  '  + 
 '   <nav class="menu menu_header ffalt bglink boxed auto">  '  + 
 '   <ul class="fz11 fw600 tar tac auto ">  '  + 
 '   <li class="dib pt9 pb9"><a class="cwhite ctitle-hover " href="./gimnasia/">GIMNASIA</a></li>  '  + 
 '   <li class="dib pt9 pb9"><a class="cwhite ctitle-hover is_current ctitle" href="./estudiantes/">ESTUDIANTES</a></li>  '  + 
 '   <li class="dib pt9 pb9"><a class="cwhite ctitle-hover " href="./san_carlos/">SAN CARLOS</a></li>  '  + 
 '   <li class="dib pt9 pb9"><a class="cwhite ctitle-hover " href="./cambaceres/">CAMBACERES</a></li>  '  + 
 '   <li class="dib pt9 pb9"><a class="cwhite ctitle-hover " href="./informes/">INFORMES</a></li>  '  + 
 '   <li class="dib pt9 pb9"><a class="cwhite ctitle-hover " href="./editorial/">EDITORIAL</a></li>  '  + 
 '   <li class="dib pt9 pb9"><a class="cwhite ctitle-hover " href="./futbol/">FÚTBOL</a></li>  '  + 
 '   <li class="dib pt9 pb9"><a class="cwhite ctitle-hover " href="./rugby/">RUGBY</a></li>  '  + 
 '   <li class="dib pt9 pb9"><a class="cwhite ctitle-hover " href="./basquet/">BASQUET</a></li>  '  + 
 '   <li class="dib pt9 pb9"><a class="cwhite mr8 ctitle-hover " href="./polideportivo/">POLIDEPORTIVO</a></li>  '  + 
 '   </ul>  '  + 
 '   </nav>  '  + 
 '   <nav class=" menu_responsive ffalt bglink boxed auto dn">  '  + 
 '   <a href="javascript:;" class="dn icono-menu">  '  + 
 '   <i class="fa fa-bars fa-2x cwhite mt5 mb5"></i>  '  + 
 '   </a>  '  + 
 '   <ul class="fz13 fw600 tar tac auto ">  '  + 
 '   <li class="db"><a class="cwhite ctitle-hover " href="./gimnasia/">GIMNASIA</a></li>  '  + 
 '   <li class="db"><a class="cwhite ctitle-hover is_current ctitle" href="./estudiantes/">ESTUDIANTES</a></li>  '  + 
 '   <li class="db"><a class="cwhite ctitle-hover " href="./san_carlos/">SAN CARLOS</a></li>  '  + 
 '   <li class="db"><a class="cwhite ctitle-hover " href="./cambaceres/">CAMBACERES</a></li>  '  + 
 '   <li class="db"><a class="cwhite ctitle-hover " href="./informes/">INFORMES</a></li>  '  + 
 '   <li class="db"><a class="cwhite ctitle-hover " href="./editorial/">EDITORIAL</a></li>  '  + 
 '   <li class="db"><a class="cwhite ctitle-hover " href="./futbol/">FÚTBOL</a></li>  '  + 
 '   <li class="db"><a class="cwhite ctitle-hover " href="./rugby/">RUGBY</a></li>  '  + 
 '   <li class="db"><a class="cwhite ctitle-hover " href="./basquet/">BASQUET</a></li>  '  + 
 '   <li class="db"><a class="cwhite ctitle-hover " href="./polideportivo/">POLIDEPORTIVO</a></li>  '  + 
 '   </ul>  '  + 
 '   </nav>  '  + 
 '   <script>  '  + 
 '    $(function(){  '  + 
 '        $(".menu_responsive ul").slideToggle("fast");  '  + 
 '      });  '  + 
 '    });  '  + 
 '   </script>  '  + 
 '   </header>  '  + 
 '   <div class="contenido  boxed auto bgwhite pt10">  '  + 
 '   <div id="header-seccion" class="g12 estudiantes p4 posr">  '  + 
 '   <div class="filete bdwhite">  '  + 
 '   <div class="middle_magic dib ">  '  + 
 '   <h1 class="fz38 lh34 ffalt bold cwhite ttu g12 posr">  '  + 
 '   <img src="./images/icon-seccion-estudiantes.png" class="mr20 ml30">  '  + 
 '   <span class="posa" style="top: 34%;    left: 100%;  display: block; min-width: 262px;">Estudiantes </span>  '  + 
 '   </h1>  '  + 
 '   </div>  '  + 
 '   <div class="g5 flr fz10 ffalt tac cwhite lh13 middle_magic">  '  + 
 '   <div class="g12">  '  + 
 '   <div class="g6 fll mr bdr bdwhite">  '  + 
 '   ÚLTIMO PARTIDO <br>  '  + 
 '   BANFIELD 0 vs. ESTUDIANTES 2 </div>  '  + 
 '   <div class="g6 fll ">  '  + 
 '   <span class="bold">PRÓXIMO PARTIDO <br>  '  + 
 '   ESTUDIANTES vs. RIVER PLATE </br></span>  '  + 
 '   SÁBADO 03/11 - 17.45 h. </div>  '  + 
 '   </div>  '  + 
 '   </div>  '  + 
 '   <div class="clear"></div>  '  + 
 '   </div>  '  + 
 '   <img src="./images/imagen-seccion-estudiantes.png" alt="" class="posa bottom imagen-seccion">  '  + 
 '   </div>  '  + 
 '   <div class="clear"></div>  '  + 
 '   <section id="noticias-destacadas-seccion" class="mt">  '  + 
 '   <article class="g6 fll noticia-principal ffalt posr  is_audio">  '  + 
 '   <a href="nota/83459/sorpresivo_reclamo_de_gaston_fernandez_hacia_benitez/">  '  + 
 '   <figure class="posr">  '  + 
 '   <div class="icon-audio icon64 posa top left"></div>  '  + 
 '   <img src="./uploads/noticias/imagenes/medias/20181030195135_la_gata_portal1.png" alt="Sorpresivo reclamo de Gastón Fernández hacia Benítez">  '  + 
 '   </figure>  '  + 
 '   <div class="placa-titulo posa bottom z9 g12">  '  + 
 '   <div class="momento bgtitle ctext fz10 dib pl10 pr10 ffalt">Ayer</div>  '  + 
 '   <h2 class="fz12 ttu bglink cwhite db pl10 pr10">En conferencia</h2>  '  + 
 '   <h1 class="fz28 lh30 bold ttu cwhite cwhite p10 pt15 pb15">Sorpresivo reclamo de Gastón Fernández hacia Benítez</h1>  '  + 
 '   </div>  '  + 
 '   </a>  '  + 
 '   </article>  '  + 
 '   <section class="g6 fll noticias-secundarias ml">  '  + 
 '   <article class="bgbody mb noticia-5 pb is_video ">  '  + 
 '   <a href="nota/83456/benitez_yo_no_hubiese_dejado_ir_a_damonte/">  '  + 
 '   <figure class="g6 fll mr posr">  '  + 
 '   <div class="icon-video icon32 posa top left"></div>  '  + 
 '   <div class="momento bgtitle ctext ffalt fz10 dib pl10 pr10 posa bottom left z9">Ayer</div>  '  + 
 '   <img src="./uploads/noticias/imagenes/chicas/20181030133327_damobenitez.jpg" alt="Benítez: “Yo no hubiese dejado ir a Damonte”">  '  + 
 '   </figure>  '  + 
 '   <div class="g6 fll p8">  '  + 
 '   <h2 class="fz10 lh12 ffalt clink ttu mb5">Exclusivo CIELOSPORTS</h2>  '  + 
 '   <h1 class="fz17 lh19 ffalt bold ctext mb10">Benítez: “Yo no hubiese dejado ir a Damonte”</h1>  '  + 
 '   <span class="ffalt ctext fz12 lh15 dib pb30 ovh">  '  + 
 '   El Chino opinó sobre la salida de una pieza importante en la mitad de la cancha a comienzos de este año, y se paró en la vereda opuesta a la de Lucas Bernardi. </span>  '  + 
 '   </div>  '  + 
 '   <div class="clear"></div>  '  + 
 '   </a>  '  + 
 '   </article>  '  + 
 '   <article class="bgbody mb noticia-5 pb  ">  '  + 
 '   <a href="nota/83450/los_campeones_del_mundo_visitaran_el_noroeste_argentino/">  '  + 
 '   <figure class="g6 fll mr posr">  '  + 
 '   <div class="momento bgtitle ctext ffalt fz10 dib pl10 pr10 posa bottom left z9">Ayer</div>  '  + 
 '   <img src="./uploads/noticias/imagenes/chicas/20181030071140_edlp_campeones_1.jpg" alt="Los campeones del mundo visitarán el Noroeste argentino">  '  + 
 '   </figure>  '  + 
 '   <div class="g6 fll p8">  '  + 
 '   <h2 class="fz10 lh12 ffalt clink ttu mb5">Héroes de Old Trafford</h2>  '  + 
 '   <h1 class="fz17 lh19 ffalt bold ctext mb10">Los campeones del mundo visitarán el Noroeste argentino</h1>  '  + 
 '   <span class="ffalt ctext fz12 lh15 dib pb30 ovh">  '  + 
 '   Cuatro de los integrantes de aquel Estudiantes partirán de gira junto a Juan Sebastián Verón. Será desde mañana y hasta el día sábado. </span>  '  + 
 '   </div>  '  + 
 '   <div class="clear"></div>  '  + 
 '   </a>  '  + 
 '   </article>  '  + 
 '   </section>  '  + 
 '   </section>  '  + 
 '   <div class="clear"></div>  '  + 
 '   <section id="columna1" class="g6 fll mt">  '  + 
 '   <div class="banner mb10 clear">  '  + 
 '   <a href="https://infocielo.com/deportes/aca_hay_una_escuela" target="_blank">  '  + 
 '   <img src="./uploads/banners/20180829094726_banner_seccion_edelp.gif" class="">  '  + 
 '   </a>  '  + 
 '   </div>  '  + 
 '   <div id="paginator_content"><article class="bdb bdtextlight mb noticia-6 pb  is_audio">  '  + 
 '   <a href="nota/83449/sanchez_buscamos_la_simpleza_para_sumar/">  '  + 
 '   <figure class="g4 fll mr posr">  '  + 
 '   <div class="icon-audio icon32 posa top left"></div>  '  + 
 '   <img src="./uploads/noticias/imagenes/chicas/20180912114125_sanchez_5_01.jpg" alt="Sánchez: &quot;Buscamos la simpleza para sumar&quot;">  '  + 
 '   </figure>  '  + 
 '   <div class="g8 fll p8">  '  + 
 '   <h2 class="fz10 lh12 ffalt clink ttu">Ayer | Luego de la recuperación</h2>  '  + 
 '   <h1 class="fz17 lh19 ffalt bold ctext mt3 mb3 ttu">Sánchez: &quot;Buscamos la simpleza para sumar&quot;</h1>  '  + 
 '   <span class="ffalt ctext fz12 lh15 dib ovh">  '  + 
 '   El lateral fue uno de los que habló después de las dos victorias en fila que tranquilizaron los ánimos en el Pincha, y destacó la reacción del grupo. </span>  '  + 
 '   </div>  '  + 
 '   <div class="clear"></div>  '  + 
 '   </a>  '  + 
 '   </article>  '  + 
 '   <article class="bdb bdtextlight mb noticia-6 pb  ">  '  + 
 '   <a href="nota/83448/estudiantes_puso_primera_con_algunas_bajas/">  '  + 
 '   <figure class="g4 fll mr posr">  '  + 
 '   <img src="./uploads/noticias/imagenes/chicas/20180928114425_doh3tgruyaacaut.jpg" alt="Estudiantes puso primera con algunas bajas">  '  + 
 '   </figure>  '  + 
 '   <div class="g8 fll p8">  '  + 
 '   <h2 class="fz10 lh12 ffalt clink ttu">Ayer | Ya piensa en River</h2>  '  + 
 '   <h1 class="fz17 lh19 ffalt bold ctext mt3 mb3 ttu">Estudiantes puso primera con algunas bajas</h1>  '  + 
 '   <span class="ffalt ctext fz12 lh15 dib ovh">  '  + 
 '   Los jugadores Albirrojos tuvieron hoy su práctica inicial con el partido del próximo sábado en la cabeza. ¿Habrá cambios o el Chino repetirá? </span>  '  + 
 '   </div>  '  + 
 '   <div class="clear"></div>  '  + 
 '   </a>  '  + 
 '   </article>  '  + 
 '   <article class="bdb bdtextlight mb noticia-6 pb  ">  '  + 
 '   <a href="nota/83443/con_ivan_gomez_estudiantes_es_imbatible/">  '  + 
 '   <figure class="g4 fll mr posr">  '  + 
 '   <img src="./uploads/noticias/imagenes/chicas/20181029193133_20180607082225_gomez.jpg" alt="Con Iván Gómez, Estudiantes es imbatible">  '  + 
 '   </figure>  '  + 
 '   <div class="g8 fll p8">  '  + 
 '   <h2 class="fz10 lh12 ffalt clink ttu">29/10 | Juega y no pierde</h2>  '  + 
 '   <h1 class="fz17 lh19 ffalt bold ctext mt3 mb3 ttu">Con Iván Gómez, Estudiantes es imbatible</h1>  '  + 
 '   <span class="ffalt ctext fz12 lh15 dib ovh">  '  + 
 '   El juvenil volante del Pincha volvió y acomodó todas las piezas. Los resultados lo avalan y Leandro Benítez vuelve a descansar con la presencia de un todo terreno que acompañe al incansable Rodrigo Braña. </span>  '  + 
 '   </div>  '  + 
 '   <div class="clear"></div>  '  + 
 '   </a>  '  + 
 '   </article>  '  + 
 '   <article class="bdb bdtextlight mb noticia-6 pb  ">  '  + 
 '   <a href="nota/83441/mira_todo_lo_que_dejo_una_nueva_fecha_del_femenino_de_afa/">  '  + 
 '   <figure class="g4 fll mr posr">  '  + 
 '   <img src="./uploads/noticias/imagenes/chicas/20181029151215_fem.jpg" alt="Mirá todo lo que dejó una nueva fecha del Femenino de AFA">  '  + 
 '   </figure>  '  + 
 '   <div class="g8 fll p8">  '  + 
 '   <h2 class="fz10 lh12 ffalt clink ttu">29/10 | Primera y Segunda</h2>  '  + 
 '   <h1 class="fz17 lh19 ffalt bold ctext mt3 mb3 ttu">Mirá todo lo que dejó una nueva fecha del Femenino de AFA</h1>  '  + 
 '   <span class="ffalt ctext fz12 lh15 dib ovh">  '  + 
 '   Los torneos de fútbol femenino siguen su curso con la participación de Estudiantes, San Carlos y Gimnasia. Resultados y tablas luego de una nueva fecha, todo en esta nota. </span>  '  + 
 '   </div>  '  + 
 '   <div class="clear"></div>  '  + 
 '   </a>  '  + 
 '   </article>  '  + 
 '   <article class="bdb bdtextlight mb noticia-6 pb  ">  '  + 
 '   <a href="nota/83440/chau_racha_el_leon_tambien_se_saco_la_mufa_de_visitante/">  '  + 
 '   <figure class="g4 fll mr posr">  '  + 
 '   <img src="./uploads/noticias/imagenes/chicas/20181029121428_pavone.jpg" alt="Chau racha: el León también se sacó la mufa de visitante">  '  + 
 '   </figure>  '  + 
 '   <div class="g8 fll p8">  '  + 
 '   <h2 class="fz10 lh12 ffalt clink ttu">29/10 | Semana redonda</h2>  '  + 
 '   <h1 class="fz17 lh19 ffalt bold ctext mt3 mb3 ttu">Chau racha: el León también se sacó la mufa de visitante</h1>  '  + 
 '   <span class="ffalt ctext fz12 lh15 dib ovh">  '  + 
 '   Después de volver a ganar tras 8 partidos ahora Estudiantes consiguió festejar lejos de su gente, irónicamente, también después de 8 encuentros sin hacerlo. </span>  '  + 
 '   </div>  '  + 
 '   <div class="clear"></div>  '  + 
 '   </a>  '  + 
 '   </article>  '  + 
 '   <article class="bdb bdtextlight mb noticia-6 pb  ">  '  + 
 '   <a href="nota/83438/brana_un_leon_sin_dni/">  '  + 
 '   <figure class="g4 fll mr posr">  '  + 
 '   <img src="./uploads/noticias/imagenes/chicas/20181029114106_brna.jpg" alt="Braña, un León sin DNI">  '  + 
 '   </figure>  '  + 
 '   <div class="g8 fll p8">  '  + 
 '   <h2 class="fz10 lh12 ffalt clink ttu">29/10 | Entrega y sacrificio</h2>  '  + 
 '   <h1 class="fz17 lh19 ffalt bold ctext mt3 mb3 ttu">Braña, un León sin DNI</h1>  '  + 
 '   <span class="ffalt ctext fz12 lh15 dib ovh">  '  + 
 '   El volante del Pincha fue clave ayer en el Sur, con el gran despliegue al que tiene acostumbrados a los hinchas, a pesar de sus 39 años y de que fue su tercer partido en una semana. </span>  '  + 
 '   </div>  '  + 
 '   <div class="clear"></div>  '  + 
 '   </a>  '  + 
 '   </article>  '  + 
 '   <article class="bdb bdtextlight mb noticia-6 pb  is_audio">  '  + 
 '   <a href="nota/83433/fernandez_sirve_para_agarrar_confianza_y_fortalecernos/">  '  + 
 '   <figure class="g4 fll mr posr">  '  + 
 '   <div class="icon-audio icon32 posa top left"></div>  '  + 
 '   <img src="./uploads/noticias/imagenes/chicas/20181029083257_gata_3.jpg" alt="Fernández: &quot;Sirve para agarrar confianza y fortalecernos&quot;">  '  + 
 '   </figure>  '  + 
 '   <div class="g8 fll p8">  '  + 
 '   <h2 class="fz10 lh12 ffalt clink ttu">29/10 | Post Banfield</h2>  '  + 
 '   <h1 class="fz17 lh19 ffalt bold ctext mt3 mb3 ttu">Fernández: &quot;Sirve para agarrar confianza y fortalecernos&quot;</h1>  '  + 
 '   <span class="ffalt ctext fz12 lh15 dib ovh">  '  + 
 '   El delantero del Pincha fue clave en su ingreso ante el Taladro, y luego del encuentro dio su opinión sobre la mejoría del equipo en la última semana. </span>  '  + 
 '   </div>  '  + 
 '   <div class="clear"></div>  '  + 
 '   </a>  '  + 
 '   </article>  '  + 
 '   <article class="bdb bdtextlight mb noticia-6 pb  ">  '  + 
 '   <a href="nota/83431/el_pincha_descansa_luego_de_una_semana_clave/">  '  + 
 '   <figure class="g4 fll mr posr">  '  + 
 '   <img src="./uploads/noticias/imagenes/chicas/20180817153004_entrenamiento_15.jpg" alt="El Pincha descansa luego de una semana clave">  '  + 
 '   </figure>  '  + 
 '   <div class="g8 fll p8">  '  + 
 '   <h2 class="fz10 lh12 ffalt clink ttu">29/10 | Vuelve mañana</h2>  '  + 
 '   <h1 class="fz17 lh19 ffalt bold ctext mt3 mb3 ttu">El Pincha descansa luego de una semana clave</h1>  '  + 
 '   <span class="ffalt ctext fz12 lh15 dib ovh">  '  + 
 '   Después dejar atrás la mala racha, con 7 puntos sobre 9 en los últimos 8 días, el plantel del León tendrá hoy una merecida mañana sin actividad. </span>  '  + 
 '   </div>  '  + 
 '   <div class="clear"></div>  '  + 
 '   </a>  '  + 
 '   </article>  '  + 
 '   <article class="bdb bdtextlight mb noticia-6 pb  ">  '  + 
 '   <a href="nota/83429/benitez_la_gente_grande_es_la_que_esta_aportando/">  '  + 
 '   <figure class="g4 fll mr posr">  '  + 
 '   <img src="./uploads/noticias/imagenes/chicas/20181028204039_dqocxlmwkae0jby.jpg" alt="Benítez: “La gente grande es la que está aportando”">  '  + 
 '   </figure>  '  + 
 '   <div class="g8 fll p8">  '  + 
 '   <h2 class="fz10 lh12 ffalt clink ttu">28/10 | En conferencia de prensa</h2>  '  + 
 '   <h1 class="fz17 lh19 ffalt bold ctext mt3 mb3 ttu">Benítez: “La gente grande es la que está aportando”</h1>  '  + 
 '   <span class="ffalt ctext fz12 lh15 dib ovh">  '  + 
 '   El entrenador de Estudiantes, luego de la victoria, marcó la cancha y reconoció que los jugadores con experiencia tienen que llevar la bandera Pincha y mostrarles el camino correcto. </span>  '  + 
 '   </div>  '  + 
 '   <div class="clear"></div>  '  + 
 '   </a>  '  + 
 '   </article>  '  + 
 '   <article class="bdb bdtextlight mb noticia-6 pb  ">  '  + 
 '   <a href="nota/83427/gaston_fernandez_el_artesano_del_juego/">  '  + 
 '   <figure class="g4 fll mr posr">  '  + 
 '   <img src="./uploads/noticias/imagenes/chicas/20181028203354_whatsapp_image_2018_10_28_at_20_38_44.jpg" alt="Gastón Fernández, el artesano del juego">  '  + 
 '   </figure>  '  + 
 '   <div class="g8 fll p8">  '  + 
 '   <h2 class="fz10 lh12 ffalt clink ttu">28/10 | Lo necesitaban y apareció</h2>  '  + 
 '   <h1 class="fz17 lh19 ffalt bold ctext mt3 mb3 ttu">Gastón Fernández, el artesano del juego</h1>  '  + 
 '   <span class="ffalt ctext fz12 lh15 dib ovh">  '  + 
 '   La Gata tiene claridad, tiene ideas, tiene juego y marca la diferencia. Durante un tiempo no tuvo oportunidades. En otro momento, no tuvo esa claridad para construir. Ante Newell´s y ante Banfield aportó su estilo y el equipo mejoró, creció y ganó. </span>  '  + 
 '   </div>  '  + 
 '   <div class="clear"></div>  '  + 
 '   </a>  '  + 
 '   </article>  '  + 
 '   <article class="bdb bdtextlight mb noticia-6 pb  ">  '  + 
 '   <a href="nota/83425/estudiantes_es_un_tanque/">  '  + 
 '   <figure class="g4 fll mr posr">  '  + 
 '   <img src="./uploads/noticias/imagenes/chicas/20181028201854_pavone_estudiantes_banfield_superliga_fotobaires.jpg" alt="Estudiantes es un Tanque">  '  + 
 '   </figure>  '  + 
 '   <div class="g8 fll p8">  '  + 
 '   <h2 class="fz10 lh12 ffalt clink ttu">28/10 | Análisis</h2>  '  + 
 '   <h1 class="fz17 lh19 ffalt bold ctext mt3 mb3 ttu">Estudiantes es un Tanque</h1>  '  + 
 '   <span class="ffalt ctext fz12 lh15 dib ovh">  '  + 
 '   Venía sin nafta, pero le cargó en la última semana y terminó consiguiendo 7 puntos de 9 en juego. No fue mucho más que Banfield, que incluso por momentos fue mejor, pero volvió a quedarse con las tres unidades. </span>  '  + 
 '   </div>  '  + 
 '   <div class="clear"></div>  '  + 
 '   </a>  '  + 
 '   </article>  '  + 
 '   <article class="bdb bdtextlight mb noticia-6 pb is_video ">  '  + 
 '   <a href="nota/83424/pavone_y_sanchez_sociedad_y_facturacion_albirroja/">  '  + 
 '   <figure class="g4 fll mr posr">  '  + 
 '   <div class="icon-video icon32 posa top left"></div>  '  + 
 '   <img src="./uploads/noticias/imagenes/chicas/20181028195826_ee.jpg" alt="Pavone y Sánchez: Sociedad y facturación Albirroja">  '  + 
 '   </figure>  '  + 
 '   <div class="g8 fll p8">  '  + 
 '   <h2 class="fz10 lh12 ffalt clink ttu">28/10 | Reviví los goles</h2>  '  + 
 '   <h1 class="fz17 lh19 ffalt bold ctext mt3 mb3 ttu">Pavone y Sánchez: Sociedad y facturación Albirroja</h1>  '  + 
 '   <span class="ffalt ctext fz12 lh15 dib ovh">  '  + 
 '   El delantero y el lateral por derecha de Estudiantes, formaron una sociedad en los últimos partidos y con sus jugadas, el equipo volvió al triunfo. Facturaron en dos partidos, y el León sumó seis puntos. </span>  '  + 
 '   </div>  '  + 
 '   <div class="clear"></div>  '  + 
 '   </a>  '  + 
 '   </article>  '  + 
 '   <article class="bdb bdtextlight mb noticia-6 pb  ">  '  + 
 '   <a href="nota/83419/las_leonas_no_pudieron_frente_a_san_lorenzo/">  '  + 
 '   <figure class="g4 fll mr posr">  '  + 
 '   <img src="./uploads/noticias/imagenes/chicas/20181028183554_est_fem.jpg" alt="Las Leonas no pudieron frente a San Lorenzo">  '  + 
 '   </figure>  '  + 
 '   <div class="g8 fll p8">  '  + 
 '   <h2 class="fz10 lh12 ffalt clink ttu">28/10 | Derrota por 2 a 0</h2>  '  + 
 '   <h1 class="fz17 lh19 ffalt bold ctext mt3 mb3 ttu">Las Leonas no pudieron frente a San Lorenzo</h1>  '  + 
 '   <span class="ffalt ctext fz12 lh15 dib ovh">  '  + 
 '   El equipo femenino de Estudiantes no pudo como local ante el Ciclón, y se quedó sin sumar en un partido clave, complicando su clasificación a la Zona Campeonato. </span>  '  + 
 '   </div>  '  + 
 '   <div class="clear"></div>  '  + 
 '   </a>  '  + 
 '   </article>  '  + 
 '   <article class="bdb bdtextlight mb noticia-6 pb is_video ">  '  + 
 '   <a href="nota/83418/estudiantes_planto_bandera_en_el_sur_y_vencio_a_banfield/">  '  + 
 '   <figure class="g4 fll mr posr">  '  + 
 '   <div class="icon-video icon32 posa top left"></div>  '  + 
 '   <img src="./uploads/noticias/imagenes/chicas/20181028194102_dqos_k_xqaeaqlj.jpg" alt="Estudiantes plantó bandera en el sur y venció a Banfield">  '  + 
 '   </figure>  '  + 
 '   <div class="g8 fll p8">  '  + 
 '   <h2 class="fz10 lh12 ffalt clink ttu">28/10 | Ganó en el Florencio Sola 2 a 0</h2>  '  + 
 '   <h1 class="fz17 lh19 ffalt bold ctext mt3 mb3 ttu">Estudiantes plantó bandera en el sur y venció a Banfield</h1>  '  + 
 '   <span class="ffalt ctext fz12 lh15 dib ovh">  '  + 
 '   Luego de la victoria con Newell&#039;s, el equipo de Leandro Benítez se sacó la mala racha como visitante y venció al Taladro. Pavone y Zuqui metieron los goles en una tarde que tenía pinta de 0 a 0. </span>  '  + 
 '   </div>  '  + 
 '   <div class="clear"></div>  '  + 
 '   </a>  '  + 
 '   </article>  '  + 
 '   <article class="bdb bdtextlight mb noticia-6 pb  ">  '  + 
 '   <a href="nota/83417/quiere_volver_a_ganar_6_anos_despues/">  '  + 
 '   <figure class="g4 fll mr posr">  '  + 
 '   <img src="./uploads/noticias/imagenes/chicas/20181028143224_00035935.jpg" alt="Quiere volver a ganar 6 años después">  '  + 
 '   </figure>  '  + 
 '   <div class="g8 fll p8">  '  + 
 '   <h2 class="fz10 lh12 ffalt clink ttu">28/10 | Historial</h2>  '  + 
 '   <h1 class="fz17 lh19 ffalt bold ctext mt3 mb3 ttu">Quiere volver a ganar 6 años después</h1>  '  + 
 '   <span class="ffalt ctext fz12 lh15 dib ovh">  '  + 
 '   A Estudiantes no le está yendo bien contra Banfield, o al menos en este último tiempo. Para encontrar la última victoria ah que viajar al sur del Gran Buenos Aires pero en el año 2012. </span>  '  + 
 '   </div>  '  + 
 '   <div class="clear"></div>  '  + 
 '   </a>  '  + 
 '   </article>  '  + 
 '   <article class="bdb bdtextlight mb noticia-6 pb  ">  '  + 
 '   <a href="nota/83414/benitez_ante_banfield_tenemos_un_nuevo_desafio/">  '  + 
 '   <figure class="g4 fll mr posr">  '  + 
 '   <img src="./uploads/noticias/imagenes/chicas/20181028130422_dp4scwmxcaa7hje.jpg" alt="Benítez: “Ante Banfield tenemos un nuevo desafío”">  '  + 
 '   </figure>  '  + 
 '   <div class="g8 fll p8">  '  + 
 '   <h2 class="fz10 lh12 ffalt clink ttu">28/10 | Uno más para el Chino</h2>  '  + 
 '   <h1 class="fz17 lh19 ffalt bold ctext mt3 mb3 ttu">Benítez: “Ante Banfield tenemos un nuevo desafío”</h1>  '  + 
 '   <span class="ffalt ctext fz12 lh15 dib ovh">  '  + 
 '   El entrenador de Estudiantes habló ante los medios en la previa de este partido, al cual piensa como un paso más en franco crecimiento. </span>  '  + 
 '   </div>  '  + 
 '   <div class="clear"></div>  '  + 
 '   </a>  '  + 
 '   </article>  '  + 
 '   <article class="bdb bdtextlight mb noticia-6 pb  ">  '  + 
 '   <a href="nota/83413/zuqui_tenemos_que_seguir_con_el_sacrificio/">  '  + 
 '   <figure class="g4 fll mr posr">  '  + 
 '   <img src="./uploads/noticias/imagenes/chicas/20181028122154_20171207093448_zuqui.jpg" alt="Zuqui: “Tenemos que seguir con el sacrificio”">  '  + 
 '   </figure>  '  + 
 '   <div class="g8 fll p8">  '  + 
 '   <h2 class="fz10 lh12 ffalt clink ttu">28/10 | Avisó en conferencia</h2>  '  + 
 '   <h1 class="fz17 lh19 ffalt bold ctext mt3 mb3 ttu">Zuqui: “Tenemos que seguir con el sacrificio”</h1>  '  + 
 '   <span class="ffalt ctext fz12 lh15 dib ovh">  '  + 
 '   El volante de Estudiantes que volverá a ser de la partida y dejó en claro qué necesita el equipo para volver a ganar. </span>  '  + 
 '   </div>  '  + 
 '   <div class="clear"></div>  '  + 
 '   </a>  '  + 
 '   </article>  '  + 
 '   <article class="bdb bdtextlight mb noticia-6 pb  ">  '  + 
 '   <a href="nota/83408/arciero_no_hay_que_dejar_jugar_a_estudiantes/">  '  + 
 '   <figure class="g4 fll mr posr">  '  + 
 '   <img src="./uploads/noticias/imagenes/chicas/20181028110423_47400_con_el_ushuaiense_rodrigo_arciero_de_titular_banfield_recien_a_defensa_y_justicia.jpg" alt="Arciero: “No hay que dejar jugar a Estudiantes”">  '  + 
 '   </figure>  '  + 
 '   <div class="g8 fll p8">  '  + 
 '   <h2 class="fz10 lh12 ffalt clink ttu">28/10 | Adelantó el lateral</h2>  '  + 
 '   <h1 class="fz17 lh19 ffalt bold ctext mt3 mb3 ttu">Arciero: “No hay que dejar jugar a Estudiantes”</h1>  '  + 
 '   <span class="ffalt ctext fz12 lh15 dib ovh">  '  + 
 '   El defensor de Banfield tiene en claro como plantearle el partido al Pincha, y también avisó que deben hacerse fuertes de local. </span>  '  + 
 '   </div>  '  + 
 '   <div class="clear"></div>  '  + 
 '   </a>  '  + 
 '   </article>  '  + 
 '   <article class="bdb bdtextlight mb noticia-6 pb  ">  '  + 
 '   <a href="nota/83405/las_leonas_buscan_volver_a_sonreir_ante_san_lorenzo/">  '  + 
 '   <figure class="g4 fll mr posr">  '  + 
 '   <img src="./uploads/noticias/imagenes/chicas/20181028095159_mat2040_800x500.jpg" alt="Las Leonas buscan volver a sonreír ante San Lorenzo">  '  + 
 '   </figure>  '  + 
 '   <div class="g8 fll p8">  '  + 
 '   <h2 class="fz10 lh12 ffalt clink ttu">28/10 | Desde las 15.30</h2>  '  + 
 '   <h1 class="fz17 lh19 ffalt bold ctext mt3 mb3 ttu">Las Leonas buscan volver a sonreír ante San Lorenzo</h1>  '  + 
 '   <span class="ffalt ctext fz12 lh15 dib ovh">  '  + 
 '   El equipo dirigido por Pablo Pastor esta tarde necesita volver al triunfo y nada mejor que hacerlo en casa. </span>  '  + 
 '   </div>  '  + 
 '   <div class="clear"></div>  '  + 
 '   </a>  '  + 
 '   </article>  '  + 
 '   <article class="bdb bdtextlight mb noticia-6 pb  ">  '  + 
 '   <a href="nota/83403/estudiantes_quiere_mas_y_ahora_va_por_banfield_en_el_sur/">  '  + 
 '   <figure class="g4 fll mr posr">  '  + 
 '   <img src="./uploads/noticias/imagenes/chicas/20181028085325_estudiantes.jpg" alt="Estudiantes quiere más y ahora va por Banfield en el sur">  '  + 
 '   </figure>  '  + 
 '   <div class="g8 fll p8">  '  + 
 '   <h2 class="fz10 lh12 ffalt clink ttu">28/10 | Desde las 17.45</h2>  '  + 
 '   <h1 class="fz17 lh19 ffalt bold ctext mt3 mb3 ttu">Estudiantes quiere más y ahora va por Banfield en el sur</h1>  '  + 
 '   <span class="ffalt ctext fz12 lh15 dib ovh">  '  + 
 '   El equipo de Leandro Benítez sabe que la parada de esta tarde no será para nada fácil, pero más allá de eso, es una buena oportunidad para seguir en el camino del triunfo por el cual hacía mucho que no caminaba. </span>  '  + 
 '   </div>  '  + 
 '   <div class="clear"></div>  '  + 
 '   </a>  '  + 
 '   </article>  '  + 
 '   </div><script type="text/javascript">  '  + 
 '   /*  '  + 
 '   paginator_custom es el plugin para paginar datos de un modelo especifico  '  + 
 '   se lo llama desde la function paginatorCustom en functions.php  '  + 
 '   introduce los resultados en un div de id paginator_content  '  + 
 '   */  '  + 
 '     '  + 
 '   var pagina = 1,  '  + 
 '       elementos = true;  '  + 
 '       result = false;  '  + 
 '     '  + 
 '   $(function() {  '  + 
 '       //escondo el boton loading  '  + 
 '     '  + 
 '       //cargo la 2da pagina ni bien entro (quedan cargados en var elementos)  '  + 
 '       loadElementos();  '  + 
 '     '  + 
 '       //cuando clickeo el boton muestro la pagina cargada y cargo una nueva pagina  '  + 
 '           e.preventDefault();  '  + 
 '           $("#paginator_content").append(elementos);  '  + 
 '           loadElementos();  '  + 
 '       });  '  + 
 '     '  + 
 '   });  '  + 
 '     '  + 
 '   //Carga elementos via ajax  '  + 
 '   function loadElementos(){  '  + 
 '     '  + 
 '       //llamo por ajax a paginator.php, que me devuelve un html con el layout  '  + 
 '       $.post(  '  + 
 '           {  '  + 
 '           },  '  + 
 '           function(items) {  '  + 
 '               //Si items esta vacio no hay mas paginas  '  + 
 '               if (!items) {  '  + 
 '                   //seteo el boton elementos en false para que no muestre mas elementos  '  + 
 '                   elementos = false;  '  + 
 '                   //borro el boton para paginar  '  + 
 '               } else {  '  + 
 '                   elementos = items;  '  + 
 '               }  '  + 
 '           }  '  + 
 '       );  '  + 
 '   };  '  + 
 '     '  + 
 '   </script>  '  + 
 '   <div id="paginator" class="first center g12">  '  + 
 '   <a href="#paginator" class="fw700 fz12 bglink ffalt cbody p2 g8 tac pl20 pr20  mb20 ttu db  auto clear">CARGAR MÁS NOTICIAS</a>  '  + 
 '   <class="center none bglink" src="./images/loader.gif">  '  + 
 '   </div>  '  + 
 '   </section>  '  + 
 '   <aside id="columna2" class="g3 fll ml mt">  '  + 
 '   <script type="text/javascript" src="js/encuestas.js"></script>  '  + 
 '   <section id="encuestas" class="ovh">  '  + 
 '   </section>  '  + 
 '   <div id="mas-leidas-seccion">  '  + 
 '   <h1 class="mt bglink fz14 ffalt bold p5 pl10 cwhite ttu mb10">MÁS LEÍDAS DE Estudiantes</h1>  '  + 
 '   <article class="bdb bdtextlight mb noticia-7 pb  ">  '  + 
 '   <a href="nota/83361/asi_sera_el_fin_de_semana_del_femenino/">  '  + 
 '   <figure class="g4 fll mr posr">  '  + 
 '   <img src="./uploads/noticias/imagenes/chicas/20181026083047_escudos.jpg" alt="Así será el fin de semana del Femenino">  '  + 
 '   </figure>  '  + 
 '   <div class="g8 fll p8">  '  + 
 '   <h2 class="fz10 lh12 ffalt clink ttu">26/10 | Todo el domingo</h2>  '  + 
 '   <h1 class="fz12 lh15 ffalt bold ctext mt3 mb3 ttu">Así será el fin de semana del Femenino</h1>  '  + 
 '   </div>  '  + 
 '   <div class="clear"></div>  '  + 
 '   </a>  '  + 
 '   </article>  '  + 
 '   <article class="bdb bdtextlight mb noticia-7 pb  ">  '  + 
 '   <a href="nota/83413/zuqui_tenemos_que_seguir_con_el_sacrificio/">  '  + 
 '   <figure class="g4 fll mr posr">  '  + 
 '   <img src="./uploads/noticias/imagenes/chicas/20181028122154_20171207093448_zuqui.jpg" alt="Zuqui: “Tenemos que seguir con el sacrificio”">  '  + 
 '   </figure>  '  + 
 '   <div class="g8 fll p8">  '  + 
 '   <h2 class="fz10 lh12 ffalt clink ttu">28/10 | Avisó en conferencia</h2>  '  + 
 '   <h1 class="fz12 lh15 ffalt bold ctext mt3 mb3 ttu">Zuqui: “Tenemos que seguir con el sacrificio”</h1>  '  + 
 '   </div>  '  + 
 '   <div class="clear"></div>  '  + 
 '   </a>  '  + 
 '   </article>  '  + 
 '   <article class="bdb bdtextlight mb noticia-7 pb  ">  '  + 
 '   <a href="nota/83408/arciero_no_hay_que_dejar_jugar_a_estudiantes/">  '  + 
 '   <figure class="g4 fll mr posr">  '  + 
 '   <img src="./uploads/noticias/imagenes/chicas/20181028110423_47400_con_el_ushuaiense_rodrigo_arciero_de_titular_banfield_recien_a_defensa_y_justicia.jpg" alt="Arciero: “No hay que dejar jugar a Estudiantes”">  '  + 
 '   </figure>  '  + 
 '   <div class="g8 fll p8">  '  + 
 '   <h2 class="fz10 lh12 ffalt clink ttu">28/10 | Adelantó el lateral</h2>  '  + 
 '   <h1 class="fz12 lh15 ffalt bold ctext mt3 mb3 ttu">Arciero: “No hay que dejar jugar a Estudiantes”</h1>  '  + 
 '   </div>  '  + 
 '   <div class="clear"></div>  '  + 
 '   </a>  '  + 
 '   </article>  '  + 
 '   <article class="bdb bdtextlight mb noticia-7 pb  ">  '  + 
 '   <a href="nota/83405/las_leonas_buscan_volver_a_sonreir_ante_san_lorenzo/">  '  + 
 '   <figure class="g4 fll mr posr">  '  + 
 '   <img src="./uploads/noticias/imagenes/chicas/20181028095159_mat2040_800x500.jpg" alt="Las Leonas buscan volver a sonreír ante San Lorenzo">  '  + 
 '   </figure>  '  + 
 '   <div class="g8 fll p8">  '  + 
 '   <h2 class="fz10 lh12 ffalt clink ttu">28/10 | Desde las 15.30</h2>  '  + 
 '   <h1 class="fz12 lh15 ffalt bold ctext mt3 mb3 ttu">Las Leonas buscan volver a sonreír ante San Lorenzo</h1>  '  + 
 '   </div>  '  + 
 '   <div class="clear"></div>  '  + 
 '   </a>  '  + 
 '   </article>  '  + 
 '   <article class="bdb bdtextlight mb noticia-7 pb  ">  '  + 
 '   <a href="nota/83380/arranca_la_fecha_12_en_etapa_de_definiciones/">  '  + 
 '   <figure class="g4 fll mr posr">  '  + 
 '   <img src="./uploads/noticias/imagenes/chicas/20181027082444_est_gim.png" alt="Arranca la fecha 12, en etapa de definiciones">  '  + 
 '   </figure>  '  + 
 '   <div class="g8 fll p8">  '  + 
 '   <h2 class="fz10 lh12 ffalt clink ttu">27/10 | Divisiones Inferiores</h2>  '  + 
 '   <h1 class="fz12 lh15 ffalt bold ctext mt3 mb3 ttu">Arranca la fecha 12, en etapa de definiciones</h1>  '  + 
 '   </div>  '  + 
 '   <div class="clear"></div>  '  + 
 '   </a>  '  + 
 '   </article>  '  + 
 '   </div>  '  + 
 '   <script src="./datafactory/html/v3/htmlCenterApp.js"></script>  '  + 
 '   <section id="estadisticas" class="ffalt mb20 owh">  '  + 
 '   <h1 class="mt bglink fz14 ffalt bold p5 pl10 cwhite ttu">GOLEADORES DE Estudiantes</h1>  '  + 
 '   <table class="g12 bgbody ffalt fz11 p6 mb20">  '  + 
 '   <thead>  '  + 
 '   <tr class="bdb bdtextlight ">  '  + 
 '   <th class="tal pl">JUGADOR</th>  '  + 
 '   <th class="tar pr">GOLES</th>  '  + 
 '   </tr>  '  + 
 '   </thead>  '  + 
 '   <tbody>  '  + 
 '   <tr class="bdb bdtextlight lh12">  '  + 
 '   <td class="tal pl">• Fabián Noguera</td>  '  + 
 '   <td class="tar pr">2</td>  '  + 
 '   </tr>  '  + 
 '   <tr class="bdb bdtextlight lh12">  '  + 
 '   <td class="tal pl">• Mariano Pavone</td>  '  + 
 '   <td class="tar pr">2</td>  '  + 
 '   </tr>  '  + 
 '   <tr class="bdb bdtextlight lh12">  '  + 
 '   <td class="tal pl">• Matías Pellegrini</td>  '  + 
 '   <td class="tar pr">2</td>  '  + 
 '   </tr>  '  + 
 '   <tr class="bdb bdtextlight lh12">  '  + 
 '   <td class="tal pl">• Juan F. Apaolaza</td>  '  + 
 '   <td class="tar pr">1</td>  '  + 
 '   </tr>  '  + 
 '   <tr class="bdb bdtextlight lh12">  '  + 
 '   <td class="tal pl">• Nahuel Estévez</td>  '  + 
 '   <td class="tar pr">1</td>  '  + 
 '   </tr>  '  + 
 '   <tr class="bdb bdtextlight lh12">  '  + 
 '   <td class="tal pl">• Fernando Zuqui</td>  '  + 
 '   <td class="tar pr">1</td>  '  + 
 '   </tr>  '  + 
 '   </tbody>  '  + 
 '   </table>  '  + 
 '   <script type="text/javascript" src="./js/fancybox/jquery.fancybox.js?v=2.1.5"></script>  '  + 
 '   <link rel="stylesheet" type="text/css" href="./js/fancybox/jquery.fancybox.css?v=2.1.5" media="screen" />  '  + 
 '   <h1 class="mt bglink fz14 ffalt bold p5 pl10 cwhite ttu">PARTIDOS JUGADOS DE Estudiantes</h1>  '  + 
 '   <table class="g12 bgbody ffalt fz11 p6 mb20">  '  + 
 '   <thead>  '  + 
 '   <tr class="bdb bdtextlight ">  '  + 
 '   <th class="tal pl">FECHA</th>  '  + 
 '   <th class="tar pr">EQUIPOS</th>  '  + 
 '   </tr>  '  + 
 '   </thead>  '  + 
 '   <tbody>  '  + 
 '   <tr class="bdb bdtextlight lh12">  '  + 
 '   <td class="tal pl">• 1</td>  '  + 
 '   <td class="tar pr">  '  + 
 '   Godoy Cruz(1) vs Estudiantes(0) </a>  '  + 
 '   </td>  '  + 
 '   </tr>  '  + 
 '   <tr class="bdb bdtextlight lh12">  '  + 
 '   <td class="tal pl">• 2</td>  '  + 
 '   <td class="tar pr">  '  + 
 '   Estudiantes(2) vs Boca Juniors(0) </a>  '  + 
 '   </td>  '  + 
 '   </tr>  '  + 
 '   <tr class="bdb bdtextlight lh12">  '  + 
 '   <td class="tal pl">• 3</td>  '  + 
 '   <td class="tar pr">  '  + 
 '   Belgrano(2) vs Estudiantes(1) </a>  '  + 
 '   </td>  '  + 
 '   </tr>  '  + 
 '   <tr class="bdb bdtextlight lh12">  '  + 
 '   <td class="tal pl">• 4</td>  '  + 
 '   <td class="tar pr">  '  + 
 '   Estudiantes(2) vs Independiente(2) </a>  '  + 
 '   </td>  '  + 
 '   </tr>  '  + 
 '   <tr class="bdb bdtextlight lh12">  '  + 
 '   <td class="tal pl">• 5</td>  '  + 
 '   <td class="tar pr">  '  + 
 '   Estudiantes(0) vs Aldosivi(2) </a>  '  + 
 '   </td>  '  + 
 '   </tr>  '  + 
 '   <tr class="bdb bdtextlight lh12">  '  + 
 '   <td class="tal pl">• 7</td>  '  + 
 '   <td class="tar pr">  '  + 
 '   Estudiantes(1) vs Newell`s(0) </a>  '  + 
 '   </td>  '  + 
 '   </tr>  '  + 
 '   <tr class="bdb bdtextlight lh12">  '  + 
 '   <td class="tal pl">• 8</td>  '  + 
 '    <td class="tar pr">  '  + 
 '   Tigre(1) vs Estudiantes(0) </a>  '  + 
 '   </td>  '  + 
 '   </tr>  '  + 
 '   <tr class="bdb bdtextlight lh12">  '  + 
 '   <td class="tal pl">• 9</td>  '  + 
 '   <td class="tar pr">  '  + 
 '   Estudiantes(1) vs Atlético Tucumán(1) </a>  '  + 
 '   </td>  '  + 
 '   </tr>  '  + 
 '   <tr class="bdb bdtextlight lh12">  '  + 
 '   <td class="tal pl">• 10</td>  '  + 
 '   <td class="tar pr">  '  + 
 '   Banfield(0) vs Estudiantes(2) </a>  '  + 
 '   </td>  '  + 
 '   </tr>  '  + 
 '   </tbody>  '  + 
 '   </table>  '  + 
 '   <script type="text/javascript">  '  + 
 '       $(document).ready(function() {  '  + 
 '       });  '  + 
 '   </script>  '  + 
 '   <script>  '  + 
 '           $( function() {  '  + 
 '               //     event.preventDefault();  '  + 
 '               //         ;  '  + 
 '               // });  '  + 
 '     '  + 
 '               intervalo_datafactory = setInterval(check_datafactory,500);  '  + 
 '               $(".boton-estadisticas").click( function(e){  '  + 
 '                   e.preventDefault();  '  + 
 '                   $("."+href).show();  '  + 
 '               });  '  + 
 '           });  '  + 
 '           increment = 0;  '  + 
 '           function check_datafactory(){  '  + 
 '               increment++;  '  + 
 '                   clearInterval(intervalo_datafactory);  '  + 
 '               }  '  + 
 '           }  '  + 
 '     '  + 
 '     '  + 
 '       </script>  '  + 
 '   <div class="data" style="margin-bottom:0;">  '  + 
 '   <h1 class="mt bglink fz14 ffalt bold p5 pl10 cwhite ttu">ESTADÍSTICAS</h1>  '  + 
 '   </div>  '  + 
 '   <div class="data tabla tabla-a fz11">  '  + 
 '   <div class="nav-estadisticas inarow3 pt mb3">  '  + 
 '   <a href="posiciones" class="boton-estadisticas ffalt fll dib tac bglink cwhite ttu fz10 ml g4 bglink ">Posiciones</a>  '  + 
 '   <a href="calendario" class="boton-estadisticas ffalt fll dib tac bgtextlight cwhite ttu fz10 ml g4 ">Calendario</a>  '  + 
 '   <a href="promedios" class="boton-estadisticas ffalt fll  dib tac bgtextlight cwhite ttu fz10 ml g4">Promedios</a>  '  + 
 '   <div class="clear"></div>  '  + 
 '   </div>  '  + 
 '   <div class="posiciones modulo_estadisticas">  '  + 
 '   </div>  '  + 
 '   <div class="calendario modulo_estadisticas op0">  '  + 
 '   </div>  '  + 
 '   <div class="promedios modulo_estadisticas op0">   '  + 
 '   </div>  '  + 
 '   </div>  '  + 
 '   </section>  '  + 
 '   </aside>  '  + 
 '   <aside id="columna3" class="g3 fll ml mt">  '  + 
 '   <div class="clear"></div>  '  + 
 '   <aside class="twitter_box mt mb20">  '  + 
 '   <a class="twitter-timeline" data-height="500" href="https://twitter.com/cielosports/lists/cielosports?ref_src=twsrc%5Etfw">A Twitter List by cielosports</a> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>  '  + 
 '   </aside>  '  + 
 '   <script src="./js/bxslider/plugins/jquery.fitvids.js"></script>  '  + 
 '   <script src="./js/bxslider/jquery.bxslider.js"></script>  '  +  
 '   <h1 class="bglink fz20 ffalt bold p5 pl10 cwhite">CIELOSPORTS TV</h1>  '  + 
 '   <aside class="mb10">  '  + 
 '   <ul class="posr" id="cielosports_tv">  '  + 
 '   <li>  '  + 
 '   <div class="video bgblack">  '  + 
 '   <div class="contenido_video">  '  + 
 '   <a href="javascript:;" rel="EWsZ6BQ9EBs" class="cargar-video">  '  + 
 '   <img src="https://img.youtube.com/vi/EWsZ6BQ9EBs/0.jpg" width="100%" />  '  + 
 '   </a>  '  + 
 '   </div>  '  + 
 '   <p class="fz10 lh14 clink p8 ttu">Exclusivo CIELOSPORTS TV: Cataldi, el enganche de inferiores</p>  '  + 
 '   </div>  '  + 
 '   </li>  '  + 
 '   <li>  '  + 
 '   <div class="video bgblack">  '  + 
 '   <div class="contenido_video">  '  + 
 '   <a href="javascript:;" rel="vt87iC4WmgY" class="cargar-video">  '  + 
 '   <img src="https://img.youtube.com/vi/vt87iC4WmgY/0.jpg" width="100%" />  '  + 
 '   </a>  '  + 
 '   </div>  '  + 
 '   <p class="fz10 lh14 clink p8 ttu">Exclusivo CIELOSPORTS TV: Cataldi y sus ejemplos a seguir</p>  '  + 
 '   </div>  '  + 
 '   </li>  '  + 
 '   <li>  '  + 
 '   <div class="video bgblack">  '  + 
 '   <div class="contenido_video">  '  + 
 '   <a href="javascript:;" rel="JHvmgwx3lRw" class="cargar-video">  '  + 
 '   <img src="https://img.youtube.com/vi/JHvmgwx3lRw/0.jpg" width="100%" />  '  + 
 '   </a>  '  + 
 '   </div>  '  + 
 '   <p class="fz10 lh14 clink p8 ttu">Exclusivo CIELOSPORTS TV: Cataldi y sus primeros pasos en primera 16 años después</p>  '  + 
 '   </div>  '  + 
 '   </li>  '  + 
 '   <li>  '  + 
 '   <div class="video bgblack">  '  + 
 '   <div class="contenido_video">  '  + 
 '   <a href="javascript:;" rel="dsEBfpyzdIE" class="cargar-video">  '  + 
 '   <img src="https://img.youtube.com/vi/dsEBfpyzdIE/0.jpg" width="100%" />  '  + 
 '   </a>  '  + 
 '   </div>  '  + 
 '   <p class="fz10 lh14 clink p8 ttu">Exclusivo CIELOSPORTS TV: Cataldi relató el día que su abuelo Hugo Barros Schelotto cobró en un picado familiar</p>  '  + 
 '   </div>  '  + 
 '   </li>  '  + 
 '   <li>  '  + 
 '   <div class="video bgblack">  '  + 
 '   <div class="contenido_video">  '  + 
 '   <a href="javascript:;" rel="QXcXztaESdQ" class="cargar-video">  '  + 
 '   <img src="https://img.youtube.com/vi/QXcXztaESdQ/0.jpg" width="100%" />  '  + 
 '   </a>  '  + 
 '   </div>  '  + 
 '   <p class="fz10 lh14 clink p8 ttu">Exclusivo CIELOSPORTS TV: Cataldi y la historia con sus tíos Guillermo y Gustavo Barros Schelotto</p>  '  + 
 '   </div>  '  + 
 '   </li>  '  + 
 '   <li>  '  + 
 '   <div class="video bgblack">  '  + 
 '   <div class="contenido_video">  '  + 
 '   <a href="javascript:;" rel="MkIHYNv3__Q" class="cargar-video">  '  + 
 '   <img src="https://img.youtube.com/vi/MkIHYNv3__Q/0.jpg" width="100%" />  '  + 
 '   </a>  '  + 
 '   </div>  '  + 
 '   <p class="fz10 lh14 clink p8 ttu">Exclusivo CIELOSPORTS TV: Juan Cataldi de familia Tripera y futbolera</p>  '  + 
 '   </div>  '  + 
 '   </li>  '  + 
 '   <li>  '  + 
 '   <div class="video bgblack">  '  + 
 '   <div class="contenido_video">  '  + 
 '   <a href="javascript:;" rel="gAOUaoRcKrw" class="cargar-video">  '  + 
 '   <img src="https://img.youtube.com/vi/gAOUaoRcKrw/0.jpg" width="100%" />  '  + 
 '   </a>  '  + 
 '   </div>  '  + 
 '   <p class="fz10 lh14 clink p8 ttu">Mariano Pavone volvió hecho un Tanque</p>  '  + 
 '   </div>  '  + 
 '   </li>  '  + 
 '   <li>  '  + 
 '   <div class="video bgblack">  '  + 
 '   <div class="contenido_video">  '  + 
 '   <a href="javascript:;" rel="RzDghfYdcrI" class="cargar-video">  '  + 
 '   <img src="https://img.youtube.com/vi/RzDghfYdcrI/0.jpg" width="100%" />  '  + 
 '   </a>  '  + 
 '   </div>  '  + 
 '   <p class="fz10 lh14 clink p8 ttu">Superliga - Fecha 10: Banfield 0 - Estudiantes 2</p>  '  + 
 '   </div>  '  + 
 '   </li>  '  + 
 '   <li>  '  + 
 '   <div class="video bgblack">  '  + 
 '   <div class="contenido_video">  '  + 
 '   <a href="javascript:;" rel="jnTiFN17w2A" class="cargar-video">  '  + 
 '   <img src="https://img.youtube.com/vi/jnTiFN17w2A/0.jpg" width="100%" />  '  + 
 '   </a>  '  + 
 '   </div>  '  + 
 '   <p class="fz10 lh14 clink p8 ttu">Superliga - Fecha 10: Gimnasia 2 - Boca 1</p>  '  + 
 '   </div>  '  + 
 '   </li>  '  + 
 '   <li>  '  + 
 '   <div class="video bgblack">  '  + 
 '   <div class="contenido_video">  '  + 
 '   <a href="javascript:;" rel="voEjjyv_pCI" class="cargar-video">  '  + 
 '   <img src="https://img.youtube.com/vi/voEjjyv_pCI/0.jpg" width="100%" />  '  + 
 '   </a>  '  + 
 '   </div>  '  + 
 '   <p class="fz10 lh14 clink p8 ttu">Exclusivo CIELOSPORTS TV: Leandro Benítez contó que habló con Sosa para que vuelva</p>  '  + 
 '   </div>  '  + 
 '   </li>  '  + 
 '   <li>  '  + 
 '   <div class="video bgblack">  '  + 
 '   <div class="contenido_video">  '  + 
 '   <a href="javascript:;" rel="L8gwxrhwQ6I" class="cargar-video">  '  + 
 '   <img src="https://img.youtube.com/vi/L8gwxrhwQ6I/0.jpg" width="100%" />  '  + 
 '   </a>  '  + 
 '   </div>  '  + 
 '   <p class="fz10 lh14 clink p8 ttu">Exclusivo CIELOSPORTS TV: Leandro Benítez: &quot;Nunca me voy a quedar acá solo para cobrar&quot;</p>  '  + 
 '   </div>  '  + 
 '   </li>  '  + 
 '   <li>  '  + 
 '   <div class="video bgblack">  '  + 
 '   <div class="contenido_video">  '  + 
 '   <a href="javascript:;" rel="9YQUZk6G9Lc" class="cargar-video">  '  + 
 '   <img src="https://img.youtube.com/vi/9YQUZk6G9Lc/0.jpg" width="100%" />  '  + 
 '   </a>  '  + 
 '   </div>  '  + 
 '   <p class="fz10 lh14 clink p8 ttu">Exclusivo CIELOSPORTS TV: Leandro Benítez y sus charlas con Sabella</p>  '  + 
 '   </div>  '  + 
 '   </li>  '  + 
 '   </ul>  '  + 
 '   <ul id="cielosports_tv_thumbs" class="posr mt5 bgblack">  '  + 
 '   <li>  '  + 
 '   <a data-slide-index="0" href="javascript:;" class="w100p dib p3">  '  + 
 '   <img src="https://img.youtube.com/vi/EWsZ6BQ9EBs/default.jpg" width="100%" />  '  + 
 '   <div class="ffalt fz10 clink lh12 mt3 ovh w100p">  '  + 
 '   Exclusivo CIELOSPORTS TV: Cataldi, el enganche de inferiores </div>  '  + 
 '   </a>  '  + 
 '   </li>  '  + 
 '   <li>  '  + 
 '   <a data-slide-index="1" href="javascript:;" class="w100p dib p3">  '  + 
 '   <img src="https://img.youtube.com/vi/vt87iC4WmgY/default.jpg" width="100%" />  '  + 
 '   <div class="ffalt fz10 clink lh12 mt3 ovh w100p">  '  + 
 '   Exclusivo CIELOSPORTS TV: Cataldi y sus ejemplos a seguir </div>  '  + 
 '   </a>  '  + 
 '   </li>  '  + 
 '   <li>  '  + 
 '   <a data-slide-index="2" href="javascript:;" class="w100p dib p3">  '  + 
 '   <img src="https://img.youtube.com/vi/JHvmgwx3lRw/default.jpg" width="100%" />  '  + 
 '   <div class="ffalt fz10 clink lh12 mt3 ovh w100p">  '  + 
 '   Exclusivo CIELOSPORTS TV: Cataldi y sus primeros pasos en primera 16 años después </div>  '  + 
 '   </a>  '  + 
 '   </li>  '  + 
 '   <li>  '  + 
 '   <a data-slide-index="3" href="javascript:;" class="w100p dib p3">  '  + 
 '   <img src="https://img.youtube.com/vi/dsEBfpyzdIE/default.jpg" width="100%" />  '  + 
 '   <div class="ffalt fz10 clink lh12 mt3 ovh w100p">  '  + 
 '   Exclusivo CIELOSPORTS TV: Cataldi relató el día que su abuelo Hugo Barros Schelotto cobró en un picado familiar </div>  '  + 
 '   </a>  '  + 
 '   </li>  '  + 
 '   <li>  '  + 
 '   <a data-slide-index="4" href="javascript:;" class="w100p dib p3">  '  + 
 '   <img src="https://img.youtube.com/vi/QXcXztaESdQ/default.jpg" width="100%" />  '  + 
 '   <div class="ffalt fz10 clink lh12 mt3 ovh w100p">  '  + 
 '   Exclusivo CIELOSPORTS TV: Cataldi y la historia con sus tíos Guillermo y Gustavo Barros Schelotto </div>  '  + 
 '   </a>  '  + 
 '   </li>  '  + 
 '   <li>  '  + 
 '   <a data-slide-index="5" href="javascript:;" class="w100p dib p3">  '  + 
 '   <img src="https://img.youtube.com/vi/MkIHYNv3__Q/default.jpg" width="100%" />  '  + 
 '   <div class="ffalt fz10 clink lh12 mt3 ovh w100p">  '  + 
 '   Exclusivo CIELOSPORTS TV: Juan Cataldi de familia Tripera y futbolera </div>  '  + 
 '   </a>  '  + 
 '   </li>  '  + 
 '   <li>  '  + 
 '   <a data-slide-index="6" href="javascript:;" class="w100p dib p3">  '  + 
 '   <img src="https://img.youtube.com/vi/gAOUaoRcKrw/default.jpg" width="100%" />  '  + 
 '   <div class="ffalt fz10 clink lh12 mt3 ovh w100p">  '  + 
 '   Mariano Pavone volvió hecho un Tanque </div>  '  + 
 '   </a>  '  + 
 '   </li>  '  + 
 '   <li>  '  + 
 '   <a data-slide-index="7" href="javascript:;" class="w100p dib p3">  '  + 
 '   <img src="https://img.youtube.com/vi/RzDghfYdcrI/default.jpg" width="100%" />  '  + 
 '   <div class="ffalt fz10 clink lh12 mt3 ovh w100p">  '  + 
 '   Superliga - Fecha 10: Banfield 0 - Estudiantes 2 </div>  '  + 
 '   </a>  '  + 
 '   </li>  '  + 
 '   <li>  '  + 
 '   <a data-slide-index="8" href="javascript:;" class="w100p dib p3">  '  + 
 '   <img src="https://img.youtube.com/vi/jnTiFN17w2A/default.jpg" width="100%" />  '  + 
 '   <div class="ffalt fz10 clink lh12 mt3 ovh w100p">  '  + 
 '   Superliga - Fecha 10: Gimnasia 2 - Boca 1 </div>  '  + 
 '   </a>  '  + 
 '   </li>  '  + 
 '   <li>  '  + 
 '   <a data-slide-index="9" href="javascript:;" class="w100p dib p3">  '  + 
 '   <img src="https://img.youtube.com/vi/voEjjyv_pCI/default.jpg" width="100%" />  '  + 
 '   <div class="ffalt fz10 clink lh12 mt3 ovh w100p">  '  + 
 '   Exclusivo CIELOSPORTS TV: Leandro Benítez contó que habló con Sosa para que vuelva </div>  '  + 
 '   </a>  '  + 
 '   </li>  '  + 
 '   <li>  '  + 
 '   <a data-slide-index="10" href="javascript:;" class="w100p dib p3">  '  + 
 '   <img src="https://img.youtube.com/vi/L8gwxrhwQ6I/default.jpg" width="100%" />  '  + 
 '   <div class="ffalt fz10 clink lh12 mt3 ovh w100p">  '  + 
 '   Exclusivo CIELOSPORTS TV: Leandro Benítez: &quot;Nunca me voy a quedar acá solo para cobrar&quot; </div>  '  + 
 '   </a>  '  + 
 '   </li>  '  + 
 '   <li>  '  + 
 '   <a data-slide-index="11" href="javascript:;" class="w100p dib p3">  '  + 
 '   <img src="https://img.youtube.com/vi/9YQUZk6G9Lc/default.jpg" width="100%" />  '  + 
 '   <div class="ffalt fz10 clink lh12 mt3 ovh w100p">  '  + 
 '   Exclusivo CIELOSPORTS TV: Leandro Benítez y sus charlas con Sabella </div>  '  + 
 '   </a>  '  + 
 '   </li>  '  + 
 '   </ul>  '  + 
 '   </aside>  '  + 
 '   <div class="fb-page mt mb10" data-href="https://www.facebook.com/CieloSports" data-width=280 data-adapt-container-width='false' data-height="500" data-small-header="true" data-hide-cover="false" data-show-facepile="true" data-show-posts="true">  '  + 
 '   <div class="fb-xfbml-parse-ignore">  '  + 
 '   <blockquote cite="https://www.facebook.com/CieloSports">  '  + 
 '   <a href="https://www.facebook.com/CieloSports">Cielosports</a>  '  + 
 '   </blockquote>  '  + 
 '   </div>  '  + 
 '   </div>  '  + 
 '     '  + 
 '   </aside>  '  + 
 '   <div class="clear"></div>  '  + 
 '   <section id="sumario" class="mt20">  '  + 
 '   <h1 class="ctext fz20 ffalt bdtextlight bdb bold pb10 mb10">SUMARIO</h1>  '  + 
 '   <div class="inarow6">  '  + 
 '   <article class="g2 fll ml mb noticia-sumario">  '  + 
 '   <a href="nota/83452/cataldi_y_el_debut_en_el_bosque_fue_especial/">  '  + 
 '   <img src="./uploads/noticias/imagenes/chicas/20181030090528_cataldi.jpg" alt="">  '  + 
 '   <div class="placa-titulo posr p5 pb10 bdt bdwhite">  '  + 
 '   <h2 class="clink fz10 ffalt ttu lh14 mt4">Exclusivo CIELOSPORTS</h2>  '  + 
 '   <h1 class="cwhite ffalt fz13 bold lh16 mt4">  '  + 
 '   Cataldi y el debut en el Bosque: &quot;Fue especial&quot; </h1>  '  + 
 '   </div>  '  + 
 '   </a>  '  + 
 '   </article>  '  + 
 '   <article class="g2 fll ml mb noticia-sumario">  '  + 
 '   <a href="nota/83443/con_ivan_gomez_estudiantes_es_imbatible/">  '  + 
 '   <img src="./uploads/noticias/imagenes/chicas/20181029193133_20180607082225_gomez.jpg" alt="">  '  + 
 '   <div class="placa-titulo posr p5 pb10 bdt bdwhite">  '  + 
 '   <h2 class="clink fz10 ffalt ttu lh14 mt4">Juega y no pierde</h2>  '  + 
 '   <h1 class="cwhite ffalt fz13 bold lh16 mt4">  '  + 
 '   Con Iván Gómez, Estudiantes es imbatible </h1>  '  + 
 '   </div>  '  + 
 '   </a>  '  + 
 '   </article>  '  + 
 '   <article class="g2 fll ml mb noticia-sumario">  '  + 
 '   <a href="nota/83445/gimnasia_empieza_hacer_del_bosque_una_fortaleza/">  '  + 
 '   <img src="./uploads/noticias/imagenes/chicas/20181029223329_fortaleza_lobo2.png" alt="">  '  + 
 '   <div class="placa-titulo posr p5 pb10 bdt bdwhite">  '  + 
 '   <h2 class="clink fz10 ffalt ttu lh14 mt4">Imparable</h2>  '  + 
 '   <h1 class="cwhite ffalt fz13 bold lh16 mt4">  '  + 
 '   Gimnasia empieza hacer del Bosque una fortaleza </h1>  '  + 
 '   </div>  '  + 
 '   </a>  '  + 
 '   </article>  '  + 
 '   <article class="g2 fll ml mb noticia-sumario">  '  + 
 '   <a href="nota/83438/brana_un_leon_sin_dni/">  '  + 
 '   <img src="./uploads/noticias/imagenes/chicas/20181029114106_brna.jpg" alt="">  '  + 
 '   <div class="placa-titulo posr p5 pb10 bdt bdwhite">  '  + 
 '   <h2 class="clink fz10 ffalt ttu lh14 mt4">Entrega y sacrificio</h2>  '  + 
 '   <h1 class="cwhite ffalt fz13 bold lh16 mt4">  '  + 
 '   Braña, un León sin DNI </h1>  '  + 
 '   </div>  '  + 
 '   </a>  '  + 
 '   </article>  '  + 
 '   <article class="g2 fll ml mb noticia-sumario">  '  + 
 '   <a href="nota/83442/cataldi_revelo_el_dia_que_su_abuelo_cobro_en_un_picado/">  '  + 
 '   <img src="./uploads/noticias/imagenes/chicas/20181029153939_whatsapp_image_2018_10_29_at_13_42_44.jpg" alt="">  '  + 
 '   <div class="placa-titulo posr p5 pb10 bdt bdwhite">  '  + 
 '   <h2 class="clink fz10 ffalt ttu lh14 mt4">Exclusivo CIELOSPORTS</h2>  '  + 
 '   <h1 class="cwhite ffalt fz13 bold lh16 mt4">  '  + 
 '   Cataldi reveló el día que su abuelo cobró en un picado </h1>  '  + 
 '   </div>  '  + 
 '   </a>  '  + 
 '   </article>  '  + 
 '   <article class="g2 fll ml mb noticia-sumario">  '  + 
 '   <a href="nota/83441/mira_todo_lo_que_dejo_una_nueva_fecha_del_femenino_de_afa/">  '  + 
 '   <img src="./uploads/noticias/imagenes/chicas/20181029151215_fem.jpg" alt="">  '  + 
 '   <div class="placa-titulo posr p5 pb10 bdt bdwhite">  '  + 
 '   <h2 class="clink fz10 ffalt ttu lh14 mt4">Primera y Segunda</h2>  '  + 
 '   <h1 class="cwhite ffalt fz13 bold lh16 mt4">  '  + 
 '   Mirá todo lo que dejó una nueva fecha del Femenino de AFA </h1>  '  + 
 '   </div>  '  + 
 '   </a>  '  + 
 '   </article>  '  + 
 '   <article class="g2 fll ml mb noticia-sumario">  '  + 
 '   <a href="nota/83439/gimnasia_encontro_lo_que_estaba_buscando/">  '  + 
 '   <img src="./uploads/noticias/imagenes/chicas/20180928114131_domflocx0aevpf4.jpg" alt="">  '  + 
 '   <div class="placa-titulo posr p5 pb10 bdt bdwhite">  '  + 
 '   <h2 class="clink fz10 ffalt ttu lh14 mt4">Presencia en ataque</h2>  '  + 
 '   <h1 class="cwhite ffalt fz13 bold lh16 mt4">  '  + 
 '   ¿Gimnasia encontró lo que estaba buscando? </h1>  '  + 
 '   </div>  '  + 
 '   </a>  '  + 
 '   </article>  '  + 
 '   <article class="g2 fll ml mb noticia-sumario">  '  + 
 '   <a href="nota/83431/el_pincha_descansa_luego_de_una_semana_clave/">  '  + 
 '   <img src="./uploads/noticias/imagenes/chicas/20180817153004_entrenamiento_15.jpg" alt="">  '  + 
 '   <div class="placa-titulo posr p5 pb10 bdt bdwhite">  '  + 
 '   <h2 class="clink fz10 ffalt ttu lh14 mt4">Vuelve mañana</h2>  '  + 
 '   <h1 class="cwhite ffalt fz13 bold lh16 mt4">  '  + 
 '   El Pincha descansa luego de una semana clave </h1>  '  + 
 '   </div>  '  + 
 '   </a>  '  + 
 '   </article>  '  + 
 '   <article class="g2 fll ml mb noticia-sumario">  '  + 
 '   <a href="nota/83430/gimnasia_puso_primera_y_se_viene_un_duelo_clave/">  '  + 
 '   <img src="./uploads/noticias/imagenes/chicas/20180929120302_dortqiqwsaip84z.jpg" alt="">  '  + 
 '   <div class="placa-titulo posr p5 pb10 bdt bdwhite">  '  + 
 '   <h2 class="clink fz10 ffalt ttu lh14 mt4">Piensa en Belgrano</h2>  '  + 
 '   <h1 class="cwhite ffalt fz13 bold lh16 mt4">  '  + 
 '   Gimnasia puso primera y se viene un duelo clave </h1>  '  + 
 '   </div>  '  + 
 '   </a>  '  + 
 '   </article>  '  + 
 '   <article class="g2 fll ml mb noticia-sumario">  '  + 
 '   <a href="nota/83433/fernandez_sirve_para_agarrar_confianza_y_fortalecernos/">  '  + 
 '   <img src="./uploads/noticias/imagenes/chicas/20181029083257_gata_3.jpg" alt="">  '  + 
 '   <div class="placa-titulo posr p5 pb10 bdt bdwhite">  '  + 
 '   <h2 class="clink fz10 ffalt ttu lh14 mt4">Post Banfield</h2>  '  + 
 '   <h1 class="cwhite ffalt fz13 bold lh16 mt4">  '  + 
 '   Fernández: &quot;Sirve para agarrar confianza y fortalecernos&quot; </h1>  '  + 
 '   </div>  '  + 
 '   </a>  '  + 
 '   </article>  '  + 
 '   <article class="g2 fll ml mb noticia-sumario">  '  + 
 '   <a href="nota/83432/rinaudo_si_perdemos_la_intensidad_perdemos_todo/">  '  + 
 '   <img src="./uploads/noticias/imagenes/chicas/20181029083659_rinaudo.jpg" alt="">  '  + 
 '   <div class="placa-titulo posr p5 pb10 bdt bdwhite">  '  + 
 '   <h2 class="clink fz10 ffalt ttu lh14 mt4">Valoró la victoria</h2>  '  + 
 '   <h1 class="cwhite ffalt fz13 bold lh16 mt4">  '  + 
 '   Rinaudo: &quot;Si perdemos la intensidad, perdemos todo&quot; </h1>  '  + 
 '   </div>  '  + 
 '   </a>  '  + 
 '   </article>  '  + 
 '   <article class="g2 fll ml mb noticia-sumario">  '  + 
 '   <a href="nota/83425/estudiantes_es_un_tanque/">  '  + 
 '   <img src="./uploads/noticias/imagenes/chicas/20181028201854_pavone_estudiantes_banfield_superliga_fotobaires.jpg" alt="">  '  + 
 '   <div class="placa-titulo posr p5 pb10 bdt bdwhite">  '  + 
 '   <h2 class="clink fz10 ffalt ttu lh14 mt4">Análisis</h2>  '  + 
 '   <h1 class="cwhite ffalt fz13 bold lh16 mt4">  '  + 
 '   Estudiantes es un Tanque </h1>  '  + 
 '   </div>  '  + 
 '   </a>  '  + 
 '   </article>  '  + 
 '   <div class="clear"></div>  '  + 
 '   </div>  '  + 
 '   </section>  '  + 
 '   </div>  '  + 
 '   <footer class="cbody ">  '  + 
 '   <div class="auto boxed bgwhite">  '  + 
 '   <hr class="bdt bdtextlight">  '  + 
 '   <div class="g6 fll mr mt30 mb30">  '  + 
 '   <a href="./"><img src="./images/logo-cielosports.png"></a>  '  + 
 '   </div>  '  + 
 '   <div class="g3 fll mr mt40 tar">  '  + 
 '   <a href="./contacto/" class="ffalt fz20 clink bold ttu mr30">Contacto</a>  '  + 
 '   <a href="./staff/" class="ffalt fz20 clink bold ttu">Staff</a>  '  + 
 '   </div>  '  + 
 '   <div class="g3 fll mt40 tar">  '  + 
 '   <a href="https://twitter.com/cielosports/" target="_blank" class="icon_social "><i class="fa fa-twitter"></i></a>  '  + 
 '   <a href="https://www.facebook.com/CieloSports" target="_blank" class="icon_social ml11"><i class="fa fa-facebook"></i></a>  '  + 
 '   <a href="https://www.instagram.com/cielosports/" target="_blank" class="icon_social ml11"><i class="fa fa-instagram"></i></a>  '  + 
 '   <a href="https://www.youtube.com/channel/UCF_mpxN6fe23SmwJ-C0i8GA" target="_blank" class="icon_social ml11"><i class="fa fa-youtube"></i></a>  '  + 
 '   </div>  '  + 
 '   <div class="clear"></div>  '  + 
 '   <nav class="menu menu_footer ffalt boxed auto bdt bdtextlight">  '  + 
 '   <ul class="fz11 fw600 tar tac auto ">  '  + 
 '   <li class="dib pt9 pb9"><a class="ctext mr8 clink-hover " href="./">HOME</a></li>  '  + 
 '   <li class="dib pt9 pb9"><a class="ctext mr8 clink-hover " href="./gimnasia/">GIMNASIA</a></li>  '  + 
 '   <li class="dib pt9 pb9"><a class="ctext mr8 clink-hover is_current clink" href="./estudiantes/">ESTUDIANTES</a></li>  '  + 
 '   <li class="dib pt9 pb9"><a class="ctext mr8 clink-hover " href="./san_carlos/">SAN CARLOS</a></li>  '  + 
 '   <li class="dib pt9 pb9"><a class="ctext mr8 clink-hover " href="./cambaceres/">CAMBACERES</a></li>  '  + 
 '   <li class="dib pt9 pb9"><a class="ctext mr8 clink-hover " href="./informes/">INFORMES</a></li>  '  + 
 '   <li class="dib pt9 pb9"><a class="ctext mr8 clink-hover " href="./editorial/">EDITORIAL</a></li>  '  + 
 '   <li class="dib pt9 pb9"><a class="ctext mr8 clink-hover " href="./futbol/">FÚTBOL</a></li>  '  + 
 '   <li class="dib pt9 pb9"><a class="ctext mr8 clink-hover " href="./rugby/">RUGBY</a></li>  '  + 
 '   <li class="dib pt9 pb9"><a class="ctext mr8 clink-hover " href="./basquet/">BASQUET</a></li>  '  + 
 '   <li class="dib pt9 pb9"><a class="ctext mr8 clink-hover " href="./polideportivo/">POLIDEPORTIVO</a></li>  '  + 
 '   </ul>  '  + 
 '   </nav>  '  + 
 '   <div class="tac bdt bdtextlight pt30 pb30">  '  + 
 '   <a href="http://cielofm.com/" target="_blank" class="dib">  '  + 
 '   <img src="./images/logo-footer0.png" alt="">  '  + 
 '   </a>  '  + 
 '   <a href="http://fmestacionmarina.com/" target="_blank" class="dib">  '  + 
 '   <img src="./images/logo-footer1.png" alt="">  '  + 
 '   </a>  '  + 
 '   <a href="http://fmcielosanbernardo.com.ar/" target="_blank" class="dib">  '  + 
 '   <img src="./images/logo-footer2.png" alt="">  '  + 
 '   </a>  '  + 
 '   <a href="http://www.radioo.com.ar/" target="_blank" class="dib">  '  + 
 '   <img src="./images/logo-footer3.png" alt="">  '  + 
 '   </a>  '  + 
 '   <a href="https://infocielo.com/" target="_blank" class="dib">  '  + 
 '   <img src="./images/logo-footer5.png" alt="">  '  + 
 '   </a>  '  + 
 '   <a href="http://infocielo.com/deportes/" target="_blank" class="dib">  '  + 
 '   <img src="./images/logo-footer6.png" alt="">  '  + 
 '   </a>  '  + 
 '   </div>  '  + 
 '   <div class="bdt bdtextlight pt20 pb20 footer-bottom">  '  + 
 '   <div class="g6 fll mr ctext fz10 arial">  '  + 
 '   © Copyright 2007 / CIELOSPORTS / Todos los derechos reservados / Grupo Cielo  '  + 
 '   </div>  '  + 
 '   <div class="g6 fll tar">  '  + 
 '   <a href="https://vorknews.com.ar/" target="_blank"><img src="./images/vork-logo.png" alt="Sistema CMS para medios digitales" /></a>  '  + 
 '   </div>  '  + 
 '   <div class="clear"></div>  '  + 
 '   </div>  '  + 
 '   </div>  '  + 
 '   </footer>  '  + 
 '   </body>  '  + 
 '  </html>  ' ; 
  function getTitleContent(noticia){
      var xpath = require('xpath')
      ,dom = require('xmldom').DOMParser;
      
      console.log("-------Noticia ",noticia,noticia.url,noticia.xpath)
      var title;
      /*fetch(noticia.url)
      .then( response => {
          //console.log("--Response: ",response) 
          return response.text()
      })
      .then(body => {*/
        
          //console.log("---Body: ",body)    
          var docu = new dom().parseFromString(body)
          //console.log("---Body: ",docu.childNodes[0])    
          var getElementByXpath = function(path) {
              //console.log("-------Path en getElement: ",xpath.select(path,docu)[0].nodeValue);
              //console.log("-------Evaluate: ",xpath.evaluate(path, docu, null, xpath.XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.lastChild.data);
              return (xpath.evaluate(path, docu, null, xpath.XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue);
          }
          //console.log("----Element a ",findElementA(getElementByXpath("//"+noticia.xpath)).attributes[1].nodeValue)
          
          try{
              title = getElementByXpath("//"+noticia.xpath).textContent
                      
          }catch(e){
              console.log("---error en get title ",e)
              title = "The path of the content has changed"
          }

          console.log("---Title",title)
         
  }
  
  [{             
                "url": "https://infocielo.com/deportes/estudiantes/",
                "xpath": "body/div[1]/section[1]/article[1]/a[1]/div[1]/h1[1]"
                
            },
            {
                
                "url": "https://infocielo.com/deportes/estudiantes/",
                "xpath": "body/div[1]/section[1]/article[1]/a[1]"
                
            },
            {
                
                "url": "https://infocielo.com/deportes/estudiantes/",
                "xpath": "body/div[1]/section[1]/article[1]"
                
            },
            {
                
                "url": "https://infocielo.com/deportes/estudiantes/",
                "xpath": "body/div[1]/section[1]"
                
            }].map((noticia)=>{
              getTitleContent(noticia)
            })
})


// CREATES A NEW USER
router.post('/', function (req, res) {
  	var name = req.body.name.toLowerCase(); //'gonza'
    //userId = req.body.userId
  	var array = []; 
    User.create({//Hace el new y el save juntos
            //userId: userId, 
            name: name,
            contenidos:array
        },function (err, user) {
            console.log("----Usuario:",user)
            if (err) return res.status(500).send("There was a problem adding the information to the database.");
            res.status(200).send(user);
        });
});

// RETURNS ALL THE USERS IN THE DATABASE
router.get('/', function (req, res) {
    User.find({}, function (err, users) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        res.status(200).send(users);
    });
});

// GETS A SINGLE USER FROM THE DATABASE
router.get('/:name', function (req, res) { //'/:usrid/:name'
    User.find({'name':req.params.name.toLowerCase()},{ '_id': 0, 'name' :1}, function (err, name) { //{"userId":req.params.usrid,
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!name || name.length == 0) return res.status(404).send("No user found.");
        console.log("Nombre",name);
        res.status(200).send(name);
    });
});

// GETS A SPECIFIC NOTICE OF ONE USER
router.get('/maxOrder/:name', function (req, res) { //'/notice/:usrid/:name'

    User.aggregate([  
      {$unwind : "$contenidos"},
      {
          "$match": {
              "name": req.params.name.toLowerCase()
          }
      },
      {
          "$group" : {
              "_id":"$_id",
              "maxOrder" : {"$max" : "$contenidos.order"},
              "contents": { $push: "$contenidos"}
          }
      },
      { 
          $project: {
            contenidos:"$contents",
            maxOrder:"$maxOrder"
          }
      }
    ]).then(function (result){
      console.log(result)
      res.status(200).send(result);
    })
});

/*/ GETS THE NOTICES OF ONE USER FILTER BY CATEGORY
router.get('/notices/:category/:name', function (req, res) { //'/notices/:category/:usrid/:name'

var getCriteria = {'name':req.params.name.toLowerCase()}; //{"userId":req.params.usrid,

   User.aggregate([
    { $match: getCriteria},
    { $project: {
        contenidos: {$filter: {
            input: '$contenidos',
            as: 'item',
            cond: {$eq: ['$$item.category', req.params.category]}
        }}
    }}
    ]).then(function (result) {
      console.log(result[0].contenidos); // [ { maxBalance: 98000 } ]
      res.status(200).send(result[0].contenidos);
    });
  
});
*/

// GETS THE NOTICES OF ONE USER IN ORDER 
router.get('/noticesByOrder/:name', function (req, res) {
    
    var getCriteria = {'name':req.params.name.toLowerCase()}//,'contenidos.state':req.params.state};
    User.aggregate(
       [
        {$unwind: "$contenidos"},
        { $match: getCriteria },
        { $sort : { "contenidos.order": 1}},
        {$group: {_id:"$_id", contents: {$push:"$contenidos"}}}
       ])
    .then(function (result) {
      console.log(result); // [ { maxBalance: 98000 } ]
      res.status(200).send(result[0].contents);
    })
});

// GETS THE NOTICES OF ONE USER FILTER BY CATEGORY
router.get('/noticesByCategory/:category/:name', function (req, res) {

var getCriteria = {'name':req.params.name.toLowerCase()};

   User.aggregate([
    { $match: getCriteria},
    { $project: {
        contenidos: {$filter: {
            input: '$contenidos',
            as: 'item',
            cond: {$eq: ['$$item.category', req.params.category]}
        }}
    }}
    ]).then(function (result) {
      console.log(result[0].contenidos); // [ { maxBalance: 98000 } ]
      res.status(200).send(result[0].contenidos);
    });
  
});

// GETS THE NOTICES OF ONE USER FILTER BY STATE(new/old)
router.get('/noticesByState/:state/:name', function (req, res) {

    var getCriteria = {'name':req.params.name.toLowerCase()}//,'contenidos.state':req.params.state};
    User.aggregate([
    { $match: getCriteria},
    { $project: {
        contenidos: {$filter: {
            input: '$contenidos',
            as: 'item',
            cond: {$eq: ['$$item.state', req.params.state]}
        }}
    }}
    ]).then(function (result) {
      console.log(result[0].contenidos); // [ { maxBalance: 98000 } ]
      res.status(200).send(result[0].contenidos);
    });

});

// GETS THE CATEGORIES OF ONE USER 
router.get('/categories/:name', function (req, res) { //'/categories/:usrid/:name'
    User.distinct('contenidos.category',{'name':req.params.name.toLowerCase()}, function(err, result){ //{'userId':req.params.usrid,
	  if (err) return res.status(500).send("There was a problem finding the user.");
      if (!result || result.length == 0) return res.status(200).send("");
      console.log(result)
      res.status(200).send(result);
	});	    
});


// DELETES A USER FROM THE DATABASE
router.delete('/:name', function (req, res) { //'/:usrid/:name'
    User.findOneAndRemove({"name":req.params.name.toLowerCase()}, function (err, user) { //{"userId":req.params.usrid,
        if (err) return res.status(500).send("There was a problem deleting the user.");
        res.status(200).send("User "+ req.params.name +" was deleted.");
    });
});

// DELETES A CONTENT FROM A USER 
router.delete('/deleteContent/:name', function (req, res) { //'/:usrid/:name'
 
});

//UPDATE THE STATE OF GROUP OF CONTENTS
router.put('/updateContentsByState/user/:name', function (req, res) {

        //var getCriteria = {'name':req.params.name.toLowerCase()}//,'contenidos.state':req.params.state};    
        //console.log(result[0]);
        User.update({'name':req.params.name.toLowerCase(),'contenidos.state': 'new'}, 
        {'$set': {
          'contenidos.$[elem].state': 'edited'
          }},{ "arrayFilters": [{ "elem.state": 'new' }], "multi": true }
        ,(err,doc)=>{
          //console.log("---contenido ",doc)
          res.status(200).send(doc);
        }) 
});


//UPDATE A LIST OF CONTENTS
router.put('/updateListContents/user/:name', function (req, res) {

        var updates = req.body.map((item)=>{
            return User.update({'name':req.params.name.toLowerCase()}, 
              {"$set": {
                'contenidos.$[elem].order': item.order
              }},{ "arrayFilters": [{$and:[{'elem.url':item.url},{'elem.xpath':item.xpath}]}]})       
        });

        Promise.all(updates).then((results)=>{
            console.log(results);
            res.status(200).send(req.body)
        }); 
});


//UPDATE THE STATE OF A CONTENT 
router.put('/updateContent/user/:name',function(req, res) {

  User.findOne({ name: req.params.name.toLowerCase()})//agregar password
  .select({ contenidos: {$elemMatch: {url:req.body.url,xpath:req.body.xpath}}})
  .exec((err, resul)=> { 
    //console.log("---contenido ",resul)
    var state = (resul.contenidos[0].state=='new')?'edited':'new';
    User.findOneAndUpdate({'contenidos._id':resul.contenidos[0]._id} ,{ $set: { 'contenidos.$.state': state }},(err,doc)=>{
      //console.log("---contenido ",doc)
      res.status(200).send(doc);
    })
  }) 
});


//ADD A LIST OF CONTENT INTO THE COLLECTION OF A USER
router.put('/addListContent/user/:name',function(req, res) {
  var functionContains = function(array,obj){
    for (i = 0; i < array.length; i++) {
            //console.log("  aver ",(array[i] == obj),array[i],obj)
            if (array[i].xpath === obj.xpath && array[i].url === obj.url ) 
                return true
        }
        return false;
  };

	var contBody = req.body;
  var query = { 'name': req.params.name.toLowerCase()};//agregar password
    User.aggregate([  
      {$unwind : "$contenidos"},
      {
          "$match": {
              "name": req.params.name.toLowerCase()
          }
      },
      {
          "$group" : {
              "_id":"$_id",
              "maxOrder" : {"$max" : "$contenidos.order"},
              "contents": { $push: "$contenidos"}
          }
      },
      { 
          $project: {
            contenidos:"$contents",
            maxOrder:"$maxOrder"
          }
      }
    ])
    .then(function (result){

       var contents = []
       let promises = contBody.map((elem,index)=>{ 
        console.log(elem,contBody)
        if(result.length > 0){
          if(!functionContains(result[0].contenidos,elem))//si no se repiten los contenidos
            elem.order = result[0].maxOrder + index + 1
        }else{
          elem.order = index
        }
        return contents.push(elem);
       });
       
       Promise.all(promises).then((resultArray)=>{
          console.log("res",resultArray)
          if(contents.length == 0) return res.status(400).send("No puede haber contenidos con el mismo xpath o id de una misma pagina");      
          User.findOneAndUpdate(query,{$push : {contenidos: {$each: contents} }}, function (err,user) {//{url:req.body.url,xpath:req.body.xpath}
          //user contiene el usuario antes de ser actualizado
          console.log('Actualizado ',user);
          res.status(200).send(contents);
        })
       }).catch((err)=>{
        console.log("error",err)
       })   
    }) 
});

//ADD A CONTENT INTO THE COLLECTION OF A USER
router.put('/addContent/user/:name',function(req, res) {
  //req.body.xpath:body/div[1]/div[1]/div[1]/div[2]/section[1]/article[1]/a[1]/h2[1]
  //req.body.url: 'https://diariohoy.net'
  //req.body.state = 'new'/'old'
  
  var criteria = { name: req.params.name.toLowerCase() };//agregar password
  User.findOne(criteria)
  .select({ contenidos: 
          {$elemMatch: 
            {url:req.body.url,
             xpath:req.body.xpath
            }
          }
         })
  .exec((err, docs)=> {
    console.log(docs)
    if(docs.contenidos.length > 0)
      res.status(404).send("Ya existe el contenido para ese usuario");  
    else{//Si no existe el contenido
          User.findOne(criteria)
            .select({ contenidos: 
                    {$elemMatch: 
                      {url:req.body.url,
                       idContent:req.body.idContent
                      }
                    }
                   })
            .exec((err, result)=> {
              console.log(result)
              if(result.contenidos.length > 0)
                res.status(404).send("Ya existe el id");  
              else{
                User.aggregate([  
                  {$unwind : "$contenidos"},
                  {
                      "$match": {
                          "name": req.params.name.toLowerCase()
                      }
                  },
                  {
                      "$group" : {
                          "_id":"$_id",
                          "maxOrder" : {"$max" : "$contenidos.order"}
                      }
                  }
                ]).then(function (elem){
                  console.log(elem)
                  const content = req.body
                  if(elem.length > 0)
                    content.order = parseInt(elem[0].maxOrder) + 1
                  else
                    content.order = 0
                  User.findOneAndUpdate(criteria, { $push: { contenidos: content }}, function (err,user) {//{url:req.body.url,xpath:req.body.xpath}
                    if(err) return res.status(500).send("There was a problem updating the user.");
                    //user contiene el usuario antes de ser actualizado
                    console.log('Actualizado ',content);
                    
                    res.status(200).send(content);
                  })
                })
                
              }
            })
      }
  })
});

module.exports = router;




/*addListContent

var functionContains = function(array,obj){
    for (i = 0; i < array.length; i++) {
            //console.log("  aver ",(array[i] == obj),array[i],obj)
            if (array[i].xpath === obj.xpath && array[i].url === obj.url) {
                return true
            }
        }
        return false;
  };

  var contBody = req.body;
  var query = { 'name': req.params.name.toLowerCase()};//agregar password
  
  User.find(query,{'contenidos._id':0}, 
    function (err, result) {
       console.log(result[0].contenidos)
       var contents = []

       var elemAnt = {idContent:""};
       var elemAct;
       
       let promises = contBody.map((elem)=>{ 
        if(!functionContains(result[0].contenidos,elem)){//si no se repiten los contenidos
          return User.aggregate([
             {$unwind:"$contenidos"},
             {$match:{"contenidos.idContent":elem.idContent, "contenidos.url":elem.url}},
             {$project:{contenidos:1,_id:0}},
             {$sort:{"contenidos.idInc":-1}},
             {$limit: 1}
             ])
          .then(function (result) {
            console.log(result[0]); 
              
              if(result[0])
                elem.idInc = result[0].contenidos.idInc + 1 //.replace(/(\d+)/,function(j,a){return a- -1;}) //incrementa el valor del identificador
              else 
                elem.idInc = 1;
              contents.push(elemAct);
            })
        }
       });
       Promise.all(promises).then((resultArray)=>{
        console.log("res",resultArray)
          User.findOneAndUpdate(query,{$push : {contenidos: {$each: contents} }}, function (err,user) {//{url:req.body.url,xpath:req.body.xpath}
          if(err) return res.status(500).send("There was a problem updating the user.");
          //user contiene el usuario antes de ser actualizado
          console.log('Actualizado ',user);
                
          res.status(200).send(contents);
        })
       }).catch((err)=>{
        console.log("error",err)
       })   
    }) 





addContent/user/name
User.aggregate([
         {$unwind:"$contenidos"},
         {$match:{"contenidos.idContent":req.body.idContent, "contenidos.url":req.body.url}},
         {$project:{contenidos:1,_id:0}},
         {$sort:{"contenidos.idInc":-1}},
         {$limit: 1}
         ])
      .then(function (result) {
        console.log(result[0]); 
        var aux=req.body;
          if(result[0])
            aux.idInc = result[0].contenidos.idInc + 1 //.replace(/(\d+)/,function(j,a){return a- -1;}) //incrementa el valor del identificador
          else
            aux.idInc = 1   //aux.idContent+1



*/