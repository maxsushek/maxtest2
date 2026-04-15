const BASE_S=100,BASE_M=70;
const DATA={
  services:[
    {id:'search',n:'Пошукова реклама',s:'За цільовими запитами у Google',on:true,badge:'',perf:true,setup:100,mgmt:55},
    {id:'brand',n:'Брендова кампанія',s:'Захист від реклами конкурентів',on:true,badge:'',perf:false,setup:35,mgmt:20},
    {id:'display',n:'Медійна реклама',s:'Банери на сайтах-партнерах',on:false,badge:'',perf:false,setup:70,mgmt:40},
    {id:'remarketing',n:'Ремаркетинг',s:'Повторні покази відвідувачам',on:false,badge:'',perf:false,setup:65,mgmt:35},
    {id:'video',n:'Відеореклама YouTube',s:'Реклама перед роликами',on:false,badge:'',perf:false,setup:90,mgmt:50},
    {id:'local',n:'Локальна реклама',s:'Google Maps та місцеві оголошення',on:false,badge:'',perf:false,setup:60,mgmt:35},
  ],
  ecom:[
    {id:'pmax',n:'Performance Max',s:'Усі канали Google в одній кампанії',on:true,badge:'TOP',perf:true,setup:130,mgmt:75},
    {id:'shopping',n:'Google Shopping',s:'Товарна реклама з фото та ціною',on:true,badge:'TOP',perf:true,setup:110,mgmt:65},
    {id:'dynremark',n:'Динамічний ремаркетинг',s:'Автопоказ переглянутих товарів',on:true,badge:'',perf:false,setup:50,mgmt:30},
    {id:'search',n:'Пошукова реклама',s:'За брендовими та категорійними запитами',on:false,badge:'',perf:true,setup:90,mgmt:55},
    {id:'brand',n:'Брендова кампанія',s:'Захист від реклами конкурентів',on:false,badge:'',perf:false,setup:35,mgmt:20},
    {id:'video',n:'Відеореклама YouTube',s:'Відеореклама для впізнаваності бренду',on:false,badge:'',perf:false,setup:75,mgmt:45},
  ],
  lead:[
    {id:'search',n:'Пошукова реклама',s:'Найточніший спосіб отримати заявки',on:true,badge:'TOP',perf:true,setup:110,mgmt:65},
    {id:'leadform',n:'Форма заявки в Google',s:'Заявка без переходу на сайт',on:true,badge:'NEW',perf:true,setup:55,mgmt:30},
    {id:'brand',n:'Брендова кампанія',s:'Захист від реклами конкурентів',on:false,badge:'',perf:false,setup:35,mgmt:20},
    {id:'display',n:'Медійна реклама',s:'Банери для охоплення аудиторії',on:false,badge:'',perf:false,setup:70,mgmt:40},
    {id:'remarketing',n:'Ремаркетинг',s:'Повторні покази тим, хто не залишив заявку',on:false,badge:'',perf:false,setup:65,mgmt:35},
    {id:'video',n:'Відеореклама YouTube',s:'Відеореклама для лідів',on:false,badge:'',perf:false,setup:90,mgmt:50},
  ]
};

const CX={
  services:[{val:'s1',t:'Простий',add:'без надбавки',mult:1},{val:'s2',t:'Середній',add:'+15% основні',mult:1.15},{val:'s3',t:'Складний',add:'+30% основні',mult:1.3},{val:'s4',t:'Дуже складний',add:'+50% основні',mult:1.5}],
  ecom:[{val:'e1',t:'Простий',add:'без надбавки',mult:1},{val:'e2',t:'Середній',add:'+15% основні',mult:1.15},{val:'e3',t:'Складний',add:'+30% основні',mult:1.3},{val:'e4',t:'Дуже складний',add:'+50% основні',mult:1.5}],
  lead:[{val:'l1',t:'Простий',add:'без надбавки',mult:1},{val:'l2',t:'Середній',add:'+15% основні',mult:1.15},{val:'l3',t:'Складний',add:'+30% основні',mult:1.3},{val:'l4',t:'Дуже складний',add:'+50% основні',mult:1.5}],
};
