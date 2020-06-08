let traces = []
let layout = {}
let tracesIndx = []
d3.text('/data/tools/geodemographics/dublin_zscores.csv')
.then((zScores)=>{
    //zScores.toString()
    //alert(typeof zScores)
    
  //alert(zScores)

  var newCsv = zScores.split('\n').map(function(line) {
    var columns = line.split(','); // get the columns
    columns.splice(0, 1); // remove total column
    return columns;
}).join('\n'); // join on newlines

//alert(newCsv)


//let columnNames = Object.keys(zScores[0])
//alert(columnNames)
  //columnNames = columnNames.filter(e=>e!=='cluster')
  //var str = JSON.stringify(zScores); 
    //var rows= str.split('\n');
  //var ro = zScores.split("\n");
  //zScores.forEach((row,i) => {
     // lines + markers, defaults to colorway
    //alert(row.split('\n'))
  //})
    //const rows = columnNames.split('\n');
//})
//alert(rows)
/*for(var i=0;i<columnNames.length;i++){
    for(var j=0;j<7;j++){
       alert(columnNames[i][j])
    }
  }*/

  /*const input = `Age0_4,Age5_14,Age25_44,Age45_64,Age65over,EU_National,ROW_National,Born_outside_Ireland,Separated,SinglePerson,Pensioner,LoneParent,DINK,NonDependentKids,RentPublic,RentPrivate,Flats,SepticTank,HEQual,Employed,TwoCars,JTWPublic,HomeWork,Students,Unemployed,EconInactFam,Manufacturing,Commerce,Transport,Public,Professional,Internet,Broadband
  -0.6543775,-1.271949501,1.654952526,-1.185074394,-0.837696175,1.775937094,2.242692637,2.003357096,-0.113202781,0.889092555,-0.731992275,-0.585023935,2.053633391,-0.856689942,-0.148711344,1.979205936,1.660350231,-0.01302735,0.957338358,0.80568349,-1.293676816,0.891346592,-0.840829061,0.512569558,-0.014738849,-1.200718685,-0.660272814,-0.249788565,0.544420141,-0.81856817,-0.811816225,0.18772075,-1.148167095
  1.789648878,0.814006895,0.997015869,-1.333410335,-1.04008133,1.226013148,0.239852434,1.020500532,0.031022436,-0.433636732,-0.83229023,0.027171939,0.261867764,-1.270480174,-0.195188345,0.661498659,0.782750169,-0.030177045,0.158161617,1.095644633,-0.001292877,0.144006056,-0.239974878,-0.537737111,0.234534484,-0.047925009,0.446321387,-0.101521532,0.383723966,-0.440849976,-0.192907565,0.659054874,-0.069750044
  -0.268010108,-0.25638973,-0.434690805,0.410665893,0.657646101,-0.439680599,-0.388784502,-0.559213825,0.620488338,0.427126223,0.368353801,0.590965477,-0.412739154,0.625841969,0.261775084,-0.515172118,-0.427186005,-0.132762559,-0.875684162,-0.679864666,-0.560546525,0.171108054,0.100808536,-0.398068009,0.395292742,0.188445837,0.143565934,-0.58717672,-0.172603794,0.346060224,0.215393616,-1.093405818,-0.124355524
  -0.398326319,-0.117318544,-0.833550626,0.699240858,0.846593877,-0.630389093,-0.484523737,-0.614917497,-0.450317892,-0.324190536,0.89165673,-0.47473418,-0.588462387,0.73461333,-0.491164286,-0.67294911,-0.627616794,-0.010292591,0.113990905,-0.498649309,0.815056614,-0.258748539,0.332862313,0.12827931,-0.653140787,0.404857222,0.054857449,0.456888093,-0.13886751,0.421822667,0.229124664,0.285313729,0.525888275
  0.549461425,1.160696225,-0.304835971,0.294232414,-0.750107299,-0.185906823,-0.383074147,-0.239398333,-0.208982212,-0.766998192,-0.611602217,-0.303619631,-0.466565008,-0.573074145,-0.396876755,-0.356919902,-0.591700104,0.475458799,-0.164647914,0.466653586,1.091256844,-0.548182124,0.720640535,0.386602787,-0.289598806,0.271898611,0.552477583,0.048036849,0.136798919,0.26630985,-0.248486299,0.705373527,0.244914248
  -0.023082922,0.700754656,-0.378028121,0.082240337,-0.350905611,-0.693552743,-0.462094383,-0.712110123,0.723667418,-0.200712094,-0.484414605,2.217983989,-0.694338304,0.348144292,2.570458959,-0.779796215,-0.043854984,-0.13677256,-1.43316611,-1.198943433,-0.930109498,0.058836953,-0.416820155,0.129742885,2.145585782,0.720982643,-0.328646668,-0.851758334,-0.733929596,-0.555715017,0.259024617,-1.206464773,-0.212537084
  -0*/
 
// get rows -> here \n as line ending is known
const rows = newCsv.split('\n');
//alert(rows)
// get the first row as header
const header = rows.shift();
//alert(header)
//const header = columnNames;
const numberOfColumns = header.split(',').length

// initialize 2D-array with a fixed size
const columnData = [...Array(numberOfColumns)].map(item => new Array());

for(let i=0; i<rows.length; i++) {
  let row = rows[i];
  let rowData = row.split(',');

  // assuming that there's always the same
  // number of columns in data rows as in header row
  for(let j=0; j<numberOfColumns; j++) {
    columnData[j].push(parseFloat(rowData[j]));
  }
}

//alert("columnData = " + JSON.stringify(columnData, null, 4));

let data = [
    {
        z: columnData,
        x: ['g1', 'g2', 'g3', 'g4', 'g5','g6','g7'],
        y: header.split(','),//['v1', 'v2', 'v3','v4','v5','v6', 'v7', 'v8','v9','v10','v11', 'v12', 'v13','v14','v15','v16','v17','v18'],
        type: 'heatmap',
        hoverongaps: true,
        showticker: true, 
        colorscale: 'Portland',
        linecolor: 'White',

        marker: {
            color: '#C8A2C8',
            line: {
                width: 2.5
            }
      }
    }  
        
    ];

    let layout = {
        title: '',
        showlegend: false,

        marker: {
            color: '#C8A2C8',
            line: {
                width: 2.5
            }
      },
      displaylogo: false,
  showSendToCloud: false,
  responsive: true,
    };
    
    //Plotly.newPlot('map-geodemos', data, layout);

    })
/*var data = [
  {
    z: [[-0.6543775,
1.789648878,
-0.268010108,
-0.398326319,
0.549461425,
-0.023082922,
-0.348444845
], [-1.271949501,
0.814006895,
-0.25638973,
-0.117318544,
1.160696225,
0.700754656,
-0.721673811
], [1.654952526,
0.997015869,
-0.434690805,
-0.833550626,
-0.304835971,
-0.378028121,
0.749263847
],[-1.185074394,
-1.333410335,
0.410665893,
0.699240858,
0.294232414,
0.082240337,
-0.309396929]
,[-0.837696175,
-1.04008133,
0.657646101,
0.846593877,
-0.750107299,
-0.350905611,
-0.158468383
]],
    x: ['g1', 'T', 'Wednesday', 'Thursday', 'Friday','d','r'],
    y: ['v1', 'v2', 'v3','v4','v5'],
    type: 'heatmap',
    hoverongaps: true
  }
];

Plotly.newPlot('map-geodemos', data);*/

