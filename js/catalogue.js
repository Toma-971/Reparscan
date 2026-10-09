// Catalogue de démonstration. EAN en préfixe 200 (usage interne GS1) : aucun conflit avec de vrais produits.
// À remplacer par le catalogue d'un distributeur partenaire (voir docs/sources-de-donnees.md).
const R=(x,y,w,h,rx=4)=>({k:"rect",x,y,w,h,rx}), O=(cx,cy,r)=>({k:"circle",cx,cy,r}), P=d=>({k:"path",d}), E=(cx,cy,rx,ry)=>({k:"ellipse",cx,cy,rx,ry});

const APPS = [
{
  id:"ll", type:"Lave-linge frontal 8 kg", brand:"Bosch", model:"Série 4 WAN28208FF", codes:{EAN:"2000000000011", "E-Nr":"WAN28208FF/01", "FD":"9908"},
  shops:["spareka.fr","sos-accessoire.com","amazon"],
  axes:["M120 220 H345","M200 300 V470"],
  parts:[
    {n:1, name:"Plan de travail", ref:"DEMO-LL-001", price:54.90, s:[R(90,22,220,20,3)], t:[330,32]},
    {n:2, name:"Carte électronique de puissance", ref:"DEMO-LL-002", price:139.00, s:[R(110,62,140,34,3)], d:["M124 72h18v14h-18zM152 72h10v14h-10zM172 76h60M172 84h40"], t:[268,78]},
    {n:3, name:"Électrovanne d'arrivée d'eau", ref:"DEMO-LL-003", price:24.50, s:[R(292,62,46,26,5)], d:["M338 75h16"], t:[315,46]},
    {n:4, name:"Cuve (demi-cuve arrière)", ref:"DEMO-LL-004", price:118.00, s:[O(120,220,68)], d:["M120 160v120M60 220h120"], t:[42,140]},
    {n:5, name:"Tambour inox", ref:"DEMO-LL-005", price:149.00, s:[O(232,220,54)], d:["M232 180a4 4 0 1 0 .1 0M210 205a3 3 0 1 0 .1 0M254 205a3 3 0 1 0 .1 0M220 245a3 3 0 1 0 .1 0M246 245a3 3 0 1 0 .1 0"], t:[232,152]},
    {n:6, name:"Joint de hublot (soufflet)", ref:"DEMO-LL-006", price:39.90, s:[O(330,220,40)], d:["M330 190a30 30 0 1 0 .1 0"], t:[372,166]},
    {n:7, name:"Résistance de chauffe 2000 W", ref:"DEMO-LL-007", price:29.90, s:[P("M70 318h18l8 -10l8 20l8 -20l8 20l8 -20l8 20l8 -20l8 20l8 -10h30v14h-130z")], t:[50,300]},
    {n:8, name:"Moteur à charbons", ref:"DEMO-LL-008", price:129.00, s:[R(160,360,84,52,8)], d:["M244 386h18M176 360v52M190 360v52"], t:[150,430]},
    {n:9, name:"Courroie Poly-V 1192 J6", ref:"DEMO-LL-009", price:14.90, s:[E(318,386,52,15)], d:["M318 386m-40 0h80"], t:[378,410]},
    {n:10, name:"Pompe de vidange", ref:"DEMO-LL-010", price:27.50, s:[O(98,450,24),R(122,442,40,16,3)], d:["M98 450m-10 0a10 10 0 1 0 20 0a10 10 0 1 0 -20 0"], t:[60,488]},
    {n:11, name:"Amortisseurs (la paire)", ref:"DEMO-LL-011", price:32.00, s:[R(268,438,14,62,6),R(296,438,14,62,6)], d:["M275 452v34M303 452v34"], t:[330,470]},
    {n:12, name:"Verrou de porte (sécurité)", ref:"DEMO-LL-012", price:19.90, s:[R(30,370,46,30,4)], d:["M40 380h26M40 390h16"], t:[53,352]}
  ],
  symptoms:[
    {id:"vid", label:"Ne vidange plus", parts:[10], why:"Une machine qui garde l'eau en fin de cycle a le plus souvent une pompe de vidange bloquée (pièce, chaussette) ou grillée.", steps:["Videz l'eau par la trappe en bas à droite et nettoyez le filtre de pompe.","Lancez une vidange seule : un bourdonnement sans écoulement indique une pompe bloquée ou HS.","Mesurez la bobine de la pompe à l'ohmmètre (environ 150 à 200 Ω attendus)."], level:"Facile"},
    {id:"chauffe", label:"L'eau ne chauffe pas", parts:[7,2], why:"Linge froid ou mal lavé : la résistance est la première suspecte, surtout en eau calcaire. Si elle est bonne, le relais de chauffe sur la carte est en cause.", steps:["Coupez le courant, retirez le dos de la machine.","Mesurez la résistance : environ 25 à 30 Ω pour 2000 W. Circuit ouvert = à remplacer.","Vérifiez l'isolement résistance/masse (une fuite fait disjoncter le différentiel)."], level:"Moyen"},
    {id:"tourne", label:"Le tambour ne tourne plus", parts:[9,8], why:"Si le moteur ronronne sans entraîner le tambour, c'est la courroie. S'il reste muet, les charbons du moteur sont usés.", steps:["Retirez le dos : la courroie est-elle sortie ou détendue ?","Tournez le tambour à la main : un frottement dur oriente vers les roulements.","Démontez le moteur et contrôlez la longueur des charbons (moins de 1 cm = usés)."], level:"Moyen"},
    {id:"porte", label:"Le hublot reste verrouillé / ne démarre pas", parts:[12,2], why:"Le verrou de porte doit confirmer la fermeture à la carte. Un verrou défectueux bloque le démarrage ou l'ouverture.", steps:["Attendez 2 minutes après la fin du cycle (temporisation normale).","Vérifiez que l'eau est bien vidangée.","Testez la continuité du verrou en position fermée."], level:"Facile"},
    {id:"fuite", label:"Fuite d'eau en façade", parts:[6,3], why:"Une fuite à l'avant vient presque toujours du joint de hublot (déchirure, objet coincé). Une fuite en haut à l'arrière oriente vers l'électrovanne.", steps:["Inspectez le soufflet en le dépliant : cherchez une déchirure en partie basse.","Contrôlez le tuyau d'arrivée et l'électrovanne pendant le remplissage."], level:"Facile"},
    {id:"bruit", label:"Gros bruit à l'essorage", parts:[11,5], why:"Des chocs à l'essorage viennent d'amortisseurs fatigués ; un grondement continu évoque plutôt les roulements du tambour.", steps:["Vérifiez que les cales de transport ont été retirées.","Appuyez sur la cuve : elle doit remonter sans rebondir.","Tambour qui a du jeu : roulements, réparation plus lourde."], level:"Moyen"}
  ]
},
{
  id:"pv", type:"Perceuse-visseuse à percussion 18 V", brand:"Makita", model:"DHP482", codes:{EAN:"2000000000028", "Modèle":"DHP482Z", "Tension":"18 V Li-ion"},
  shops:["spareka.fr","manomano.fr","amazon"],
  axes:["M30 150 H380","M300 190 V470"],
  parts:[
    {n:1, name:"Mandrin auto-serrant 13 mm", ref:"DEMO-PV-001", price:24.90, s:[P("M30 130h40l14 8v24l-14 8h-40z")], d:["M40 130v40M52 130v40"], t:[50,104]},
    {n:2, name:"Bague de réglage du couple", ref:"DEMO-PV-002", price:9.90, s:[R(100,124,22,52,4)], d:["M100 136h22M100 148h22M100 160h22"], t:[111,96]},
    {n:3, name:"Boîte d'engrenages planétaires", ref:"DEMO-PV-003", price:44.00, s:[R(140,126,64,48,6)], d:["M172 150m-12 0a12 12 0 1 0 24 0a12 12 0 1 0 -24 0"], t:[172,98]},
    {n:4, name:"Moteur 18 V", ref:"DEMO-PV-004", price:39.90, s:[R(222,124,76,52,10)], d:["M240 124v52M282 124v52"], t:[214,200]},
    {n:5, name:"Charbons (la paire)", ref:"DEMO-PV-005", price:6.50, s:[R(246,74,12,18,2),R(266,74,12,18,2)], d:["M252 92v14M272 92v14"], t:[300,70]},
    {n:6, name:"Ventilateur de refroidissement", ref:"DEMO-PV-006", price:5.90, s:[O(330,150,22)], d:["M330 128v44M308 150h44M315 135l30 30M345 135l-30 30"], t:[370,118]},
    {n:7, name:"Interrupteur / gâchette variateur", ref:"DEMO-PV-007", price:29.90, s:[R(262,224,44,40,5)], d:["M262 244h-14v14h14"], t:[230,222]},
    {n:8, name:"Inverseur de sens", ref:"DEMO-PV-008", price:4.90, s:[R(320,226,34,14,4)], t:[372,232]},
    {n:9, name:"Bornier de batterie", ref:"DEMO-PV-009", price:12.90, s:[R(268,330,64,22,3)], d:["M282 336v10M296 336v10M310 336v10"], t:[350,342]},
    {n:10, name:"Demi-coquilles de carter", ref:"DEMO-PV-010", price:21.00, s:[P("M60 300h150l10 20v40h-40l-14 90h-46l-10 -90h-50z")], d:["M80 320h120"], t:[60,280]},
    {n:11, name:"Batterie BL1850B 5,0 Ah", ref:"DEMO-PV-011", price:79.00, s:[R(250,400,110,52,8)], d:["M262 412h86M262 440h40"], t:[380,426]}
  ],
  symptoms:[
    {id:"rien", label:"Ne démarre plus du tout", parts:[11,9,7], why:"Commencez par la source : batterie à plat ou en sécurité, puis contacts du bornier oxydés, puis gâchette.", steps:["Testez avec une autre batterie chargée.","Nettoyez les lames du bornier (contact, alcool isopropylique).","Contrôlez la continuité de la gâchette appuyée."], level:"Facile"},
    {id:"etincelle", label:"Étincelles, odeur de brûlé", parts:[5,4], why:"Des étincelles visibles par les ouïes signalent des charbons en fin de vie ; une odeur forte persistante, un bobinage moteur abîmé.", steps:["Démontez les charbons : moins de 5 mm de longueur = à changer (toujours par paire).","Si le collecteur est très noirci ou rayé, prévoyez le moteur complet."], level:"Facile"},
    {id:"patine", label:"Le moteur tourne mais pas le mandrin", parts:[3,2], why:"Un moteur qui tourne sans entraîner le mandrin indique des engrenages planétaires cassés ou une bague de couple déréglée.", steps:["Réglez la bague de couple sur la position perçage.","Écoutez : un claquement régulier signale une dent cassée dans la boîte."], level:"Moyen"},
    {id:"mandrin", label:"Le mandrin ne serre plus le foret", parts:[1], why:"Mâchoires usées ou encrassées : le mandrin se change, il est vissé sur l'arbre (vis à pas à gauche à l'intérieur).", steps:["Ouvrez le mandrin au maximum, retirez la vis centrale (sens horaire).","Dévissez le mandrin avec une clé Allen serrée dedans."], level:"Facile"},
    {id:"vitesse", label:"Pas de variation de vitesse / ne s'arrête pas", parts:[7,8], why:"Le variateur est intégré à la gâchette : une seule vitesse ou un arrêt impossible signale une gâchette défectueuse.", steps:["Vérifiez que l'inverseur n'est pas à mi-course.","Remplacez l'ensemble gâchette-variateur."], level:"Moyen"}
  ]
},
{
  id:"lv", type:"Lave-vaisselle 60 cm, 13 couverts", brand:"Whirlpool", model:"WFC 3C26 P", codes:{EAN:"2000000000035", "Service":"8690 012 34", "12NC":"8690012345"},
  shops:["spareka.fr","sos-accessoire.com","amazon"],
  axes:["M200 40 V480"],
  parts:[
    {n:1, name:"Joint de porte", ref:"DEMO-LV-001", price:29.90, s:[P("M60 40h280v12h-268v260h-12z")], t:[40,30]},
    {n:2, name:"Bras de lavage supérieur", ref:"DEMO-LV-002", price:16.50, s:[R(110,100,180,14,7)], d:["M200 100v14M130 107h4M160 107h4M236 107h4M266 107h4"], t:[310,98]},
    {n:3, name:"Bras de lavage inférieur", ref:"DEMO-LV-003", price:18.90, s:[R(100,190,200,16,8)], d:["M200 190v16M124 198h4M156 198h4M240 198h4M272 198h4"], t:[320,190]},
    {n:4, name:"Filtre et micro-filtre", ref:"DEMO-LV-004", price:21.50, s:[O(200,262,26)], d:["M200 262m-14 0a14 14 0 1 0 28 0a14 14 0 1 0 -28 0M186 262h28"], t:[250,244]},
    {n:5, name:"Pompe de cyclage (moteur de lavage)", ref:"DEMO-LV-005", price:119.00, s:[R(150,320,100,56,10)], d:["M250 348h20M180 320v56"], t:[290,340]},
    {n:6, name:"Résistance de chauffe", ref:"DEMO-LV-006", price:44.90, s:[P("M70 410h120l10 10l-10 10h-120z")], d:["M90 410v20M170 410v20"], t:[52,402]},
    {n:7, name:"Pompe de vidange", ref:"DEMO-LV-007", price:26.90, s:[O(300,420,22),R(322,412,36,16,3)], d:["M300 420m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"], t:[300,464]},
    {n:8, name:"Sonde de température (CTN)", ref:"DEMO-LV-008", price:12.90, s:[R(222,410,40,12,6)], t:[242,446]},
    {n:9, name:"Électrovanne d'alimentation", ref:"DEMO-LV-009", price:22.90, s:[R(320,250,44,26,5)], d:["M364 263h14"], t:[352,226]},
    {n:10, name:"Carte de commande", ref:"DEMO-LV-010", price:96.00, s:[R(40,130,40,110,3)], d:["M50 145h20v16h-20zM50 175h20M50 185h12"], t:[24,256]},
    {n:11, name:"Aquastop (tuyau de sécurité)", ref:"DEMO-LV-011", price:34.90, s:[P("M90 470q40 -30 80 0t80 0")], t:[130,490]}
  ],
  symptoms:[
    {id:"vid", label:"Reste de l'eau au fond", parts:[4,7], why:"Un filtre colmaté est la cause numéro un. S'il est propre, la pompe de vidange est bloquée ou grillée.", steps:["Démontez et rincez le filtre et le micro-filtre.","Retirez l'eau, vérifiez que la turbine de la pompe tourne librement.","Contrôlez que le tuyau de vidange n'est pas pincé."], level:"Facile"},
    {id:"sale", label:"Vaisselle mal lavée", parts:[2,3,4], why:"Des bras de lavage aux buses bouchées ou un filtre encrassé réduisent la pression de lavage.", steps:["Démontez les bras, débouchez chaque buse avec un cure-dent.","Nettoyez le filtre, utilisez du sel régénérant en eau dure."], level:"Facile"},
    {id:"chauffe", label:"Vaisselle froide et humide", parts:[6,8], why:"La résistance ou la sonde de température : l'une ne chauffe plus, l'autre informe mal la carte.", steps:["Mesurez la résistance (environ 30 Ω).","Mesurez la CTN à froid (environ 47 kΩ à 25 °C selon modèle)."], level:"Moyen"},
    {id:"eau", label:"Ne prend pas l'eau (voyant robinet)", parts:[9,11], why:"Si le robinet est ouvert, l'Aquastop s'est déclenché sur fuite ou l'électrovanne ne s'ouvre plus.", steps:["Regardez la fenêtre de l'Aquastop : rouge = déclenché.","Mesurez la bobine de l'électrovanne (environ 3 à 4 kΩ)."], level:"Moyen"},
    {id:"fuite", label:"Fuite sous la porte", parts:[1], why:"Joint de porte durci ou déchiré, ou surdosage de produit qui fait mousser.", steps:["Inspectez le joint sur tout le tour.","Essayez un cycle sans produit pour écarter la mousse."], level:"Facile"}
  ]
}];

