USETEXTLINKS = 1
STARTALLOPEN = 0
USEFRAMES = 0
USEICONS = 1
WRAPTEXT = 1
PERSERVESTATE = 1
ICONPATH = 'images/'
foldersTree = gFld("<b></b>", "javascript:parent.op()")
foldersTree.treeID = "EireStat"


//function to get Planguage from query string
//function getQuerystring(key, default_) {
//    var url = window.location.href;

//    var url2 = url.toUpperCase();

//    if (default_ == null) default_ = "0";
//    key = key.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
//    var regex = new RegExp("[\\?&]" + key + "=([^&#]*)");

//    var qs = regex.exec(url2);
//

//    if (qs == null)
//        return default_;
//    else

//        return qs[1];
//}



//English tree node starts here

aux1 = insFld(foldersTree, gFld("<font>People and Society</font>", "javascript:parent.op()"))
aux2 = insFld(aux1, gFld("<font>Census of Population</font>", "javascript:parent.op()"))
aux4 = insFld(aux2, gFld("<font>2016 Census Results</font>", "javascript:parent.op()"))
insDoc(aux4, gLnk("S", "<font>2016 Preliminary Results</font>", "datasets.aspx?sp=DB_EP&SPtext=2016%20Preliminary%20Results"))
insDoc(aux4, gLnk("S", "<font>Summary Results Part 1</font>", "datasets.aspx?sp=DB_EY&SPtext=Summary%20Results%20Part%201"))
insDoc(aux4, gLnk("S", "<font>Profile 1 - Housing in Ireland</font>", "datasets.aspx?sp=DB_E1&SPtext=Profile 1 - Housing in Ireland"))
insDoc(aux4, gLnk("S", "<font>Profile 2 - Population Distribution and Movements</font>", "datasets.aspx?sp=DB_E2&SPtext=Profile 2 - Population Distribution and Movements"))
insDoc(aux4, gLnk("S", "<font>Summary Results Part 2</font>", "datasets.aspx?sp=DB_EZ&SPtext=Summary%20Results%20Part%202"))
insDoc(aux4, gLnk("S", "<font>Profile 3 - An Age Profile of Ireland</font>", "datasets.aspx?sp=DB_E3&SPtext=Profile 3 - An Age Profile of Ireland"))
insDoc(aux4, gLnk("S", "<font>Profile 4 - Households and Families</font>", "datasets.aspx?sp=DB_E4&SPtext=Profile 4 - Households and Families"))
insDoc(aux4, gLnk("S", "<font>Profile 5 - Homeless Persons in Ireland</font>", "datasets.aspx?sp=DB_E5&SPtext=Profile 5 - Homeless Persons in Ireland"))
insDoc(aux4, gLnk("S", "<font>Profile 6 - Commuting in Ireland</font>", "datasets.aspx?sp=DB_E6&SPtext=Profile 6 - Commuting in Ireland"))
insDoc(aux4, gLnk("S", "<font> Profile 7 - Migration and Diversity</font>", "datasets.aspx?sp=DB_E7&SPtext= Profile 7 - Migration and Diversity"))
insDoc(aux4, gLnk("S", "<font>Profile 8 - Irish Travellers, Ethnicity and Religion</font>", "datasets.aspx?sp=DB_E8&SPtext=Profile 8 - Irish Travellers, Ethnicity and Religion"))
insDoc(aux4, gLnk("S", "<font>Profile 9 - Health, Disability and Carers</font>", "datasets.aspx?sp=DB_E9&SPtext=Profile 9 - Health, Disability and Carers"))
insDoc(aux4, gLnk("S", "<font>Profile 10 - Education and Skills and the Irish Language</font>", "datasets.aspx?sp=DB_E10&SPtext=Profile 10 - Education and Skills and the Irish Language"))
insDoc(aux4, gLnk("S", "<font>Profile 11 - Employment, Occupations and Industry</font>", "datasets.aspx?sp=DB_E11&SPtext=Profile 11 - Employment, Occupations and Industry"))

aux4 = insFld(aux2, gFld("<font>2011 Census Results</font>", "javascript:parent.op()"))
insDoc(aux4, gLnk("S", "<font>This is Ireland Part 1</font>", "datasets.aspx?sp=DB_PD&SPtext=This%20is%20Ireland%20Part%201"))
insDoc(aux4, gLnk("S", "<font>This is Ireland Part 2</font>", "datasets.aspx?sp=DB_PSER&SPtext=This%20is%20Ireland%20Part%202"))
insDoc(aux4, gLnk("S", "<font>Profile 1 - Geography</font>", "datasets.aspx?sp=DB_PR1&SPtext=Profile%201%20-%20Geography"))
insDoc(aux4, gLnk("S", "<font>Profile 2 - Ages</font>", "datasets.aspx?sp=DB_PR2&SPtext=Profile%202%20-%20Ages"))
insDoc(aux4, gLnk("S", "<font>Profile 3 - At Work</font>", "datasets.aspx?sp=DB_PR3&SPtext=Profile%203%20-%20At%20Work"))
insDoc(aux4, gLnk("S", "<font>Profile 4 - The Roof Over Our Heads - Housing in Ireland</font>", "datasets.aspx?sp=DB_PR4&SPtext=Profile 4 - The Roof Over Our Heads - Housing in Ireland"))
insDoc(aux4, gLnk("S", "<font>Profile 5 - Households and Families - Living</font>", "datasets.aspx?sp=DB_PR5&SPtext=Profile 5 - Households and Families - Living"))

insDoc(aux4, gLnk("S", "<font>Profile 6 - Migration and Diversity in Ireland - A profile of diversity in Ireland</font>", "datasets.aspx?sp=DB_PR6&SPtext=Profile 6 - Migration and Diversity in Ireland - A profile of diversity in Ireland"))
insDoc(aux4, gLnk("S", "<font>Profile 7 - Religion, Ethnicity and Irish Travellers</font>", "datasets.aspx?sp=DB_PR7&SPtext=Profile%207%20-%20Religion%20Ethnicity%20and%20Irish%20Travellers"))
insDoc(aux4, gLnk("S", "<font>Profile 8 - Our Bill of Health</font>", "datasets.aspx?sp=DB_PR8&SPtext=Profile 8 - Our Bill of Health"))
insDoc(aux4, gLnk("S", "<font>Profile 9 - What we Know - A study of Education and Skills in Ireland</font>", "datasets.aspx?sp=DB_PR9&SPtext=Profile 9 - What we Know - A study of Education and Skills in Ireland"))
insDoc(aux4, gLnk("S", "<font>Profile 10 - Door to Door - Commuting in Ireland</font>", "datasets.aspx?sp=DB_PR10&SPtext=Profile 10 - Door to Door - Commuting in Ireland"))
insDoc(aux4, gLnk("S", "<font>Preliminary Results</font>", "datasets.aspx?sp=DB_CDP&SPtext=Preliminary%20Results"))

aux4 = insFld(aux2, gFld("<font>2006 Census Results</font>", "javascript:parent.op()"))
insDoc(aux4, gLnk("S", "<font>Principal Demographic Results</font>", "datasets.aspx?sp=DB_CDR&SPtext=Principal%20Demographic%20Results"))
insDoc(aux4, gLnk("S", "<font>Principal Socio-economic Results</font>", "datasets.aspx?sp=DB_CSR&SPtext=Principal%20Socio-economic%20Results"))


insDoc(aux4, gLnk("S", "<font>Volume 1 - Population Classified by Area</font>", "datasets.aspx?sp=DB_C01&SPtext=Volume%201%20-%20Population%20Classified%20by%20Area"))
insDoc(aux4, gLnk("S", "<font>Volume 2 - Ages and Marital Status</font>", "datasets.aspx?sp=DB_C02&SPtext=Volume%202%20-%20Ages%20and%20Marital%20Status"))
insDoc(aux4, gLnk("S", "<font>Volume 3 - Household Composition Family Units and Fertility</font>", "datasets.aspx?sp=DB_C03&SPtext=Volume%203%20-%20Household%20Composition,%20Family%20Units%20and%20Fertility"))
insDoc(aux4, gLnk("S", "<font>Volume 4 - Usual Residence Migration Birthplaces and Nationalities</font>", "datasets.aspx?sp=DB_C04&SPtext=Volume%204%20-%20Usual%20Residence,%20Migration,%20Birthplaces%20and%20Nationalities"))




insDoc(aux4, gLnk("S", "<font>Volume 5 - Ethnic or Cultural Background including the Irish Traveller Community</font>", "datasets.aspx?sp=DB_C05&SPtext=Volume%205%20-%20Ethnic%20or%20Cultural%20Background%20including%20the%20Irish%20Traveller%20Community"))
insDoc(aux4, gLnk("S", "<font>Volume 6 - Housing</font>", "datasets.aspx?sp=DB_C06&SPtext=Volume%206%20-%20Housing"))
insDoc(aux4, gLnk("S", "<font>Volume 7 - Principal Economic Status and Industries</font>", "datasets.aspx?sp=DB_C07&SPtext=Volume%207%20-%20Principal%20Economic%20Status%20and%20Industries"))
insDoc(aux4, gLnk("S", "<font>Volume 8 - Occupations</font>", "datasets.aspx?sp=DB_C08&SPtext=Volume%208%20-%20Occupations"))
insDoc(aux4, gLnk("S", "<font>Volume 9 - Irish Language</font>", "datasets.aspx?sp=DB_C09&SPtext=Volume%209%20-%20Irish%20Language"))
insDoc(aux4, gLnk("S", "<font>Volume 10 - Education and Qualifications</font>", "datasets.aspx?sp=DB_C10&SPtext=Volume%2010%20-%20Education%20and%20Qualifications"))
insDoc(aux4, gLnk("S", "<font>Volume 11 - Disability Carers and Voluntary Activities</font>", "datasets.aspx?sp=DB_C11&SPtext=Volume%2011%20-%20Disability,%20Carers%20and%20Voluntary%20Activities"))
insDoc(aux4, gLnk("S", "<font>Volume 12 - Travel to Work School and College</font>", "datasets.aspx?sp=DB_C12&SPtext=Volume%2012%20-%20Travel%20to%20Work,%20School%20and%20College"))
insDoc(aux4, gLnk("S", "<font>Volume 13 - Religion</font>", "datasets.aspx?sp=DB_C13&SPtext=Volume%2013%20-%20Religion"))
aux4 = insFld(aux2, gFld("<font>2002 Census Results</font>", "javascript:parent.op()"))
insDoc(aux4, gLnk("S", "<font>Principal Demographic Results 2002</font>", "datasets.aspx?sp=DB_BDR&SPtext=Principal%20Demographic%20Results%202002"))
insDoc(aux4, gLnk("S", "<font>Principal Socio-economic Results 2002</font>", "datasets.aspx?sp=DB_BSR&SPtext=Principal%20Socio-economic%20Results%202002"))


insDoc(aux4, gLnk("S", "<font>Volume 1 - Population Classified by Area 2002</font>", "datasets.aspx?sp=DB_B01&SPtext=Volume%201%20-%20Population%20Classified%20by%20Area%202002"))
insDoc(aux4, gLnk("S", "<font>Volume 2 - Ages and Marital Status 2002</font>", "datasets.aspx?sp=DB_B02&SPtext=Volume%202%20-%20Ages%20and%20Marital%20Status%202002"))
insDoc(aux4, gLnk("S", "<font>Volume 3 - Household Composition, Family Units and Fertility 2002</font>", "datasets.aspx?sp=DB_B03&SPtext=Volume%203%20-%20Household%20Composition,%20Family%20Units%20and%20Fertility%202002"))
insDoc(aux4, gLnk("S", "<font>Volume 4 - Usual Residence Migration Birthplaces and Nationalities 2002</font>", "datasets.aspx?sp=DB_B04&SPtext=Volume%204%20-%20Usual%20Residence,%20Migration,%20Birthplaces%20and%20Nationalities%202002"))




insDoc(aux4, gLnk("S", "<font>Volume 5 - Principal Economic Status and Industries 2002</font>", "datasets.aspx?sp=DB_B05&SPtext=Volume%205%20-%20Principal%20Economic%20Status%20and%20Industries%202002"))
insDoc(aux4, gLnk("S", "<font>Volume 6 - Occupations 2002</font>", "datasets.aspx?sp=DB_B06&SPtext=Volume%206%20-%20Occupations%202002"))
insDoc(aux4, gLnk("S", "<font>Volume 7 - Education and Qualifictions 2002</font>", "datasets.aspx?sp=DB_B07&SPtext=Volume%207%20-%20Education%20and%20Qualifications%202002"))
insDoc(aux4, gLnk("S", "<font>Volume 8 - Irish Traveller Community 2002</font>", "datasets.aspx?sp=DB_B08&SPtext=Volume%208%20-%20Irish%20Traveller%20Community%202002"))
insDoc(aux4, gLnk("S", "<font>Volume 9 - Travel to Work School and College 2002</font>", "datasets.aspx?sp=DB_B09&SPtext=Volume%209%20-%20Travel%20to%20Work,%20School%20and%20College%202002"))
insDoc(aux4, gLnk("S", "<font>Volume 10 - Disability and Carers 2002</font>", "datasets.aspx?sp=DB_B10&SPtext=Volume%2010%20-%20Disability%20and%20Carers%202002"))
insDoc(aux4, gLnk("S", "<font>Volume 11 - Irish Language 2002</font>", "datasets.aspx?sp=DB_B11&SPtext=Volume%2011%20-%20Irish%20Language%202002"))
insDoc(aux4, gLnk("S", "<font>Volume 12 - Religion 2002</font>", "datasets.aspx?sp=DB_B12&SPtext=Volume%2012%20-%20Religion%202002"))
insDoc(aux4, gLnk("S", "<font>Volume 13 - Housing 2002</font>", "datasets.aspx?sp=DB_B13&SPtext=Volume%2013%20-%20Housing%202002"))

// aux4 = insFld(aux2, gFld("<font>Homeless in Ireland</font>", "../../Database/eirestat/Homeless in Ireland/Homeless in Ireland_statbank.asp?SP=Homeless in Ireland&Planguage=0"))


//    aux4 = insFld(aux2, gFld("<font>Census Time Series</font>", "javascript:parent.op()"))


//    insDoc(aux4, gLnk("S", "<font>Population Marital Status and Age</font>", "../../Database/eirestat/Population Marital Status and Age/Population Marital Status and Age_statbank.asp?SP=Population Marital Status and Age&Planguage=0"))
//    insDoc(aux4, gLnk("S", "<font>Area</font>", "../../Database/eirestat/Area/Area_statbank.asp?SP=Area&Planguage=0"))
//    insDoc(aux4, gLnk("S", "<font>Employment and Industry</font>", "../../Database/eirestat/Employment and Industry/Employment and Industry_statbank.asp?SP=Employment and Industry&Planguage=0"))
//    insDoc(aux4, gLnk("S", "<font>Usual Residence and Place of Birth</font>", "../../Database/eirestat/Usual Residence and Place of Birth/Usual Residence and Place of Birth_statbank.asp?SP=Usual Residence and Place of Birth&Planguage=0"))
//    insDoc(aux4, gLnk("S", "<font>Housing</font>", "../../Database/eirestat/Housing/Housing_statbank.asp?SP=Housing&Planguage=0"))
//    insDoc(aux4, gLnk("S", "<font>Travel to Work School or College</font>", "../../Database/eirestat/Travel to Work School or College/Travel to Work School or College_statbank.asp?SP=Travel to Work School or College&Planguage=0"))
//    insDoc(aux4, gLnk("S", "<font>Disability Social Class Religion and Irish Speakers</font>", "../../Database/eirestat/Disability Social Class Religion and Irish Speakers/Disability Social Class Religion and Irish Speakers_statbank.asp?SP=Disability Social Class Religion and Irish Speakers&Planguage=0"))



aux2 = insFld(aux1, gFld("<font>Annual Population Estimates</font>", "datasets.aspx?sp=DB_PE&SPtext=Annual%20Population%20Estimates"))
aux2 = insFld(aux1, gFld("<font>Census Time Series</font>", "datasets.aspx?sp=DB_CN&SPtext=Census%20Time%20Series"))

//   aux2 = insFld(aux1, gFld("<font>Population Projections</font>", "javascript:parent.op()"))
//    insDoc(aux2, gLnk("S", "<font>Current Population and Labour Force Projections (2011 Based)</font>", "../../Database/eirestat/Current Population and Labour Force Projections (2011 Based)/Current Population and Labour Force Projections (2011 Based)_statbank.asp?SP=Current Population and Labour Force Projections (2011 Based)&Planguage=0"))
//    insDoc(aux2, gLnk("S", "<font>Previous Projections</font>", "../../Database/eirestat/Previous Projections/Previous Projections_statbank.asp?SP=Previous Projections&Planguage=0"))


aux2 = insFld(aux1, gFld("<font>Births Deaths and Marriages</font>", "javascript:parent.op()"))
insDoc(aux2, gLnk("S", "<font>Births Deaths and Marriages</font>", "datasets.aspx?sp=DB_VS&SPtext=Births%20Deaths%20and%20Marriages"))
//    aux3=insFld(aux2, gFld("<font>Births","javascript:parent.op()"))
//    insDoc(aux3, gLnk("S","<font>Births Occurrence (Final)","../../Database/eirestat/Births Occurrence/Births Occurrence_statbank.asp?SP=Births Occurrence&Planguage=0"))
// insDoc(aux3, gLnk("S","<font>Births Registered (Provisional)","../../Database/eirestat/Births Registered/Births Registered_statbank.asp?SP=Births Registered&Planguage=0"))
//aux4=insFld(aux2, gFld("<font>Deaths","javascript:parent.op()"))
//    insDoc(aux4, gLnk("S","<font>Deaths Occurrence (Final)","../../Database/eirestat/Deaths Occurrence/Deaths Occurrence_statbank.asp?SP=Deaths Occurrence&Planguage=0"))
//    insDoc(aux4, gLnk("S","<font>Deaths Registered (Provisional)","../../Database/eirestat/Deaths Registered/Deaths Registered_statbank.asp?SP=Deaths Registered&Planguage=0"))
//    insDoc(aux4, gLnk("S","<font>Mortality Differentials in Ireland","../../Database/eirestat/Mortality Differentials in Ireland/Mortality Differentials in Ireland_statbank.asp?SP=Mortality Differentials in Ireland&Planguage=0"))
//       insDoc(aux2, gLnk("S", "<font>Marriages and Civil Partnerships</font>", "../../Database/eirestat/Marriages and Civil Partnerships/Marriages and Civil Partnerships_statbank.asp?SP=Marriages and Civil Partnerships&Planguage=0"))
//    insDoc(aux2, gLnk("S", "<font>Irish Babies Names</font>", "../../Database/eirestat/Irish Babies Names/Irish Babies Names_statbank.asp?SP=Irish Babies Names&Planguage=0"))
//    insDoc(aux2, gLnk("S", "<font>Irish Life Tables</font>", "../../Database/eirestat/Irish Life Tables/Irish Life Tables_statbank.asp?SP=Irish Life Tables&Planguage=0"))

aux2 = insFld(aux1, gFld("<font>Crime and Justice</font>", "javascript:parent.op()"))
insDoc(aux2, gLnk("S", "<font>Crime and Justice</font>", "datasets.aspx?sp=DB_CJ&SPtext=Crime%20and%20Justice"))
//insDoc(aux2, gLnk("S", "<font>Detections and Proceedings</font>", "../../database/eirestat/Detections and Proceedings/Detections and Proceedings_statbank.asp?sp=Detections and Proceedings&Planguage=0"))

aux2 = insFld(aux1, gFld("<font>Social Conditions</font>", "javascript:parent.op()"))
insDoc(aux2, gLnk("S", "<font>Survey on Income and Living Conditions (SILC)</font>", "datasets.aspx?sp=DB_SI&SPtext=Survey%20on%20Income%20and%20Living%20Conditions%20(SILC)"))

aux2 = insFld(aux1, gFld("<font>Housing and Households</font>", "javascript:parent.op()"))
insDoc(aux2, gLnk("S", "<font>Planning Permissions</font>", "datasets.aspx?sp=DB_BH&SPtext=Planning%20Permissions"))
insDoc(aux2, gLnk("S", "<font>Household Travel Survey</font>", "datasets.aspx?sp=DB_HT&SPtext=Household%20Travel%20Survey"))
insDoc(aux2, gLnk("S", "<font>Household Budget Survey 2015 to 2016</font>", "datasets.aspx?sp=DB_HBS&SPtext=Household%20Budget%20Survey%202015%20to%202016"))
insDoc(aux2, gLnk("S", "<font>New Dwelling Completions</font>", "datasets.aspx?sp=DB_NDC&SPtext=New%20Dwelling%20Completions"))

aux2 = insFld(aux1, gFld("<font>Foreign National Activity</font>", "datasets.aspx?sp=DB_FN&SPtext=Foreign%20National%20Activity"))

aux2 = insFld(aux1, gFld("<font>Information Society</font>", "javascript:parent.op()"))
insDoc(aux2, gLnk("S", "<font>ICT Usage by Enterprises, Households and Persons</font>", "datasets.aspx?sp=DB_IC&SPtext=ICT Usage by Enterprises, Households and Persons"))
// insDoc(aux2, gLnk("S", "<font>ICT Usage by Households</font>", "../../Database/eirestat/ICT Usage by Households/ICT Usage by Households_statbank.asp?SP=ICT Usage by Households&Planguage=0"))
// insDoc(aux2, gLnk("S", "<font>ICT Usage by Persons</font>", "../../Database/eirestat/ICT Usage by Persons/ICT Usage by Persons_statbank.asp?SP=ICT Usage by Persons&Planguage=0"))

aux1 = insFld(foldersTree, gFld("<font>Labour Market and Earnings</font>", "javascript:parent.op()"))
aux2 = insFld(aux1, gFld("<font>Labour Market</font>", "javascript:parent.op()"))
insDoc(aux2, gLnk("S", "<font>Monthly Unemployment</font>", "datasets.aspx?sp=DB_MU&SPtext=Monthly%20Unemployment"))
insDoc(aux2, gLnk("S", "<font>Labour Force Survey Quarterly Series</font>", "datasets.aspx?sp=DB_QLF&SPtext=Labour%20Force%20Survey%20Quarterly%20Series"))
insDoc(aux2, gLnk("S", "<font>Live Register</font>", "datasets.aspx?sp=DB_LR&SPtext=Live%20Register"))
insDoc(aux2, gLnk("S", "<font>Live Register Detailed Flow Analysis (For Evaluation Only)</font>", "datasets.aspx?sp=DB_LA&SPtext=Live%20Register%20Detailed%20Flow%20Analysis"))
insDoc(aux2, gLnk("S", "<font>Labour Force Survey Detailed Employment Series</font>", "datasets.aspx?sp=DB_QES&SPtext=Labour%20Force%20Survey%20Detailed%20Employment%20Series"))
insDoc(aux2, gLnk("S", "<font>Industrial Disputes</font>", "datasets.aspx?sp=DB_ID&SPtext=Industrial%20Disputes"))
insDoc(aux2, gLnk("S", "<font>Quarterly National Household Survey - Main Results</font>", "datasets.aspx?sp=DB_QN&SPtext=Quarterly%20National%20Household%20Survey"))
insDoc(aux2, gLnk("S", "<font>Financial Business Sector</font>", "datasets.aspx?sp=DB_BI&SPtext=Financial%20Business%20Sector"))
insDoc(aux2, gLnk("S", "<font>Labour Force Survey 1988 to 1997</font>", "datasets.aspx?sp=DB_LF&SPtext=Labour%20Force%20Survey%201988%20to%201997"))
insDoc(aux2, gLnk("S", "<font>Public Sector</font>", "datasets.aspx?sp=DB_PS&SPtext=Public%20Sector"))
insDoc(aux2, gLnk("S", "<font>Earnings Employment and Productivity in Industry</font>", "datasets.aspx?sp=DB_QI&SPtext=Earnings%20Employment%20and%20Productivity%20in%20Industry"))
insDoc(aux2, gLnk("S", "<font>Retirement Planning</font>", "datasets.aspx?sp=DB_RP&SPtext=Retirement%20Planning"))

aux2 = insFld(aux1, gFld("<font>Earnings</font>", "javascript:parent.op()"))
aux3 = insFld(aux2, gFld("<font>EHECS Earnings Hours and Employment Costs Survey</font>", "javascript:parent.op()"))
insDoc(aux3, gLnk("S", "<font>EHECS Earnings Hours and Employment Costs Survey</font>", "datasets.aspx?sp=DB_EH&SPtext=EHECS%20-%20Earnings,%20Hours%20and%20Employment%20Costs%20Survey"))
//insDoc(aux3, gLnk("S", "<font>EHECS Earnings Hours and Employment Costs Survey- Quarterly</font>", "../../Database/eirestat/EHECS Earnings Hours and Employment Costs Survey Quarterly/EHECS Earnings Hours and Employment Costs Survey Quarterly_statbank.asp?SP=EHECS Earnings Hours and Employment Costs Survey Quarterly&Planguage=0"))

aux4 = insFld(aux2, gFld("<font>National Employment Survey</font>", "javascript:parent.op()"))
insDoc(aux4, gLnk("S", "<font>National Employment Survey</font>", "datasets.aspx?sp=DB_NS&SPtext=National%20Employment%20Survey"))
//insDoc(aux4, gLnk("S", "<font>National Employment Survey Modules</font>", "../../Database/eirestat/National Employment Survey Modules/National Employment Survey Modules_statbank.asp?SP=National Employment Survey Modules&Planguage=0"))
insDoc(aux2, gLnk("S", "<font>Financial Business Sector</font>", "datasets.aspx?sp=DB_BI&SPtext=Financial%20Business%20Sector"))
insDoc(aux2, gLnk("S", "<font>Public Sector</font>", "datasets.aspx?sp=DB_PS&SPtext=Public%20Sector"))
insDoc(aux2, gLnk("S", "<font>Earnings in Distribution and Business Services</font>", "datasets.aspx?sp=DB_QE&SPtext=Earnings%20in%20Distribution%20and%20Business%20Services"))
insDoc(aux2, gLnk("S", "<font>Earnings Employment and Productivity in Industry</font>", "datasets.aspx?sp=DB_QI&SPtext=Earnings%20Employment%20and%20Productivity%20in%20Industry"))








aux1 = insFld(foldersTree, gFld("<font>Economy</font>", "javascript:parent.op()"))

aux2 = insFld(aux1, gFld("<font>Prices</font>", "javascript:parent.op()"))
insDoc(aux2, gLnk("S", "<font>Agricultural Input and Output Absolute Prices</font>", "datasets.aspx?sp=DB_AJ&SPtext=Agricultural%20Input%20and%20Output%20Absolute%20Prices"))
insDoc(aux2, gLnk("S", "<font>Agricultural Input and Output Price Indices</font>", "datasets.aspx?sp=DB_AH&SPtext=Agricultural%20Input%20and%20Output%20Price%20Indices"))

aux4 = insFld(aux2, gFld("<font>Consumer Prices</font>", "javascript:parent.op()"))
insDoc(aux4, gLnk("S", "<font>Consumer Prices</font>", "datasets.aspx?sp=DB_CP&SPtext=Consumer%20Prices"))
//insDoc(aux4, gLnk("S", "<font>Consumer Prices - Monthly Series</font>", "../../Database/eirestat/Consumer Prices Monthly Series/Consumer Prices Monthly Series_statbank.asp?SP=Consumer Prices Monthly Series&Planguage=0"))

aux4 = insFld(aux2, gFld("<font>House Prices</font>", "datasets.aspx?sp=DB_HP&SPtext=House%20Prices"))


aux4 = insFld(aux2, gFld("<font>Wholesale Prices</font>", "javascript:parent.op()"))
insDoc(aux4, gLnk("S", "<font>Wholesale Prices</font>", "datasets.aspx?sp=DB_WP&SPtext=Wholesale%20Prices"))
//insDoc(aux4, gLnk("S", "<font>Wholesale Prices - Monthly Series</font>", "../../Database/eirestat/Wholesale Prices Monthly Series/Wholesale Prices Monthly Series_statbank.asp?SP=Wholesale Prices Monthly Series&Planguage=0"))

aux2 = insFld(aux1, gFld("<font>National Accounts</font>", "javascript:parent.op()"))
insDoc(aux2, gLnk("S", "<font>National Accounts Quarterly</font>", "datasets.aspx?sp=DB_NQ&SPtext=National%20Accounts%20Quarterly"))
insDoc(aux2, gLnk("S", "<font>National Income and Expenditure Annual Results 2017</font>", "datasets.aspx?sp=DB_NA17&SPtext=National Income and Expenditure Annual Results 2017"))
//insDoc(aux2, gLnk("S", "<font>National Accounts Income and Expenditure Annual Results 2012</font>", "datasets.aspx?sp=DB_NA12&SPtext=National%20Accounts%20Income%20and%20Expenditure%20Annual%20Results%202012"))
insDoc(aux2, gLnk("S", "<font>Institutional Sector Accounts: Non-Financial</font>", "datasets.aspx?sp=DB_IS&SPtext=Institutional Sector Accounts: Non-Financial"))
insDoc(aux2, gLnk("S", "<font>Institutional Sector Accounts: Financial</font>", "datasets.aspx?sp=DB_IF&SPtext=Institutional%20Sector%20Accounts:%20Financial"))
insDoc(aux2, gLnk("S", "<font>County Incomes and Regional Accounts</font>", "datasets.aspx?sp=DB_RA&SPtext=County%20Incomes%20and%20Regional%20Accounts"))
insDoc(aux2, gLnk("S", "<font>Supply and Use and Input-Output Tables</font>", "datasets.aspx?sp=DB_NI&SPtext=Supply%20and%20Use%20and%20Input%20Output%20Tables"))
insDoc(aux2, gLnk("S", "<font>Output and Value Added</font>", "datasets.aspx?sp=DB_OV&SPtext=Output%20and%20Value%20Added"))
insDoc(aux2, gLnk("S", "<font>Capital Stock of Fixed Assets</font>", "datasets.aspx?sp=DB_CS&SPtext=Capital%20Stock%20of%20Fixed%20Assets"))
insDoc(aux2, gLnk("S", "<font>Government Finance Statistics</font>", "datasets.aspx?sp=DB_GF&SPtext=Government%20Finance%20Statistics"))
insDoc(aux2, gLnk("S", "<font>National Accounts Historical Series 1970 to 1995</font>", "datasets.aspx?sp=DB_NAH&SPtext=National%20Accounts%20Historical%20Series%201970%20to%201995"))
insDoc(aux2, gLnk("S", "<font>National Accounts Historical Input-Output Tables</font>", "datasets.aspx?sp=DB_IO&SPtext=National%20Accounts%20Historical%20Input%20Output%20Tables"))



aux2 = insFld(aux1, gFld("<font>Balance of Payments</font>", "javascript:parent.op()"))
insDoc(aux2, gLnk("S", "<font>BOP - Annual and Quarterly Series</font>", "datasets.aspx?sp=DB_BP&SPtext=BOP - Annual and Quarterly Series"))
//insDoc(aux2, gLnk("S", "<font>BOP - Quarterly Series</font>", "../../Database/eirestat/BOP Quarterly Series/BOP Quarterly Series_statbank.asp?SP=BOP Quarterly Series&Planguage=0"))
aux2 = insFld(aux1, gFld("<font>External Trade</font>", "datasets.aspx?sp=DB_TS&SPtext=External Trade"))

aux2 = insFld(aux1, gFld("<font>Finance</font>", "javascript:parent.op()"))
insDoc(aux2, gLnk("S", "<font>Financial Indicators</font>", "datasets.aspx?sp=DB_FI&SPtext=Financial%20Indicators"))


aux1 = insFld(foldersTree, gFld("<font>Environment and Climate</font>", "javascript:parent.op()"))
aux2 = insFld(aux1, gFld("<font>Environment</font>", "datasets.aspx?sp=DB_EA&SPtext=Environment"))
aux2 = insFld(aux1, gFld("<font>Climate</font>", "datasets.aspx?sp=DB_MT&SPtext=Climate"))


aux1 = insFld(foldersTree, gFld("<font>Business Sectors</font>", "javascript:parent.op()"))

aux2 = insFld(aux1, gFld("<font>Multisectoral</font>", "javascript:parent.op()"))
insDoc(aux2, gLnk("S", "<font>Access to Finance</font>", "datasets.aspx?sp=DB_SF&SPtext=Access%20to%20Finance"))

aux3 = insFld(aux2, gFld("<font>International Sourcing Survey</font>", "javascript:parent.op()"))
insDoc(aux3, gLnk("S", "<font>International Sourcing Survey 2009-2011</font>", "datasets.aspx?sp=DB_ISS&SPtext=International%20Sourcing%20Survey%202009-2011"))

insDoc(aux2, gLnk("S", "<font>Structural Business Statistics Provisional Data</font>", "datasets.aspx?sp=DB_IP&SPtext=Structural%20Business%20Statistics%20Provisional%20Data"))



aux3 = insFld(aux2, gFld("<font>Foreign Affiliates Statistics</font>", "javascript:parent.op()"))
insDoc(aux3, gLnk("S", "<font>Outward Foreign Affiliates Statistics</font>", "datasets.aspx?sp=DB_FA&SPtext=Outward%20Foreign%20Affiliates%20Statistics"))

insDoc(aux2, gLnk("S", "<font>Business Demography</font>", "datasets.aspx?sp=DB_BR&SPtext=Business%20Demography"))
insDoc(aux2, gLnk("S", "<font>Job Churn</font>", "datasets.aspx?sp=DB_JC&SPtext=Job%20Churn"))
insDoc(aux2, gLnk("S", "<font>Response Burden Barometer</font>", "datasets.aspx?sp=DB_RB&SPtext=Response%20Burden%20Barometer"))

aux2 = insFld(aux1, gFld("<font>Agriculture and Fishing</font>", "javascript:parent.op()"))
insDoc(aux2, gLnk("S", "<font>Livestock and Farm Numbers</font>", "datasets.aspx?sp=DB_AA&SPtext=Agriculture%20Livestock%20and%20Farm%20Numbers"))
insDoc(aux2, gLnk("S", "<font>Supply Balances</font>", "datasets.aspx?sp=DB_AB&SPtext=Agriculture%20Supply%20Balances"))
insDoc(aux2, gLnk("S", "<font>Livestock Slaughterings</font>", "datasets.aspx?sp=DB_AD&SPtext=Agriculture%20Livestock%20Slaughterings"))
insDoc(aux2, gLnk("S", "<font>Regional Accounts</font>", "datasets.aspx?sp=DB_AC&SPtext=Agriculture%20Regional%20Accounts"))
insDoc(aux2, gLnk("S", "<font>Agricultural Output, Input and Income</font>", "datasets.aspx?sp=DB_AE&SPtext=Agricultural%20Output,%20Input%20and%20Income"))
insDoc(aux2, gLnk("S", "<font>Agricultural Input and Output Price Indices</font>", "datasets.aspx?sp=DB_AH&SPtext=Agricultural%20Input%20and%20Output%20Price%20Indices"))
insDoc(aux2, gLnk("S", "<font>Agricultural Input and Output Absolute Prices</font>", "datasets.aspx?sp=DB_AJ&SPtext=Agricultural%20Input%20and%20Output%20Absolute%20Prices"))
insDoc(aux2, gLnk("S", "<font>Milk Production</font>", "datasets.aspx?sp=DB_AK&SPtext=Agriculture%20Milk%20Production"))
insDoc(aux2, gLnk("S", "<font>Agriculture Area Used and Crop Production</font>", "datasets.aspx?sp=DB_AQ&SPtext=Agriculture%20Area%20Used%20and%20Crop%20Production"))
insDoc(aux2, gLnk("S", "<font>Land Sales</font>", "datasets.aspx?sp=DB_AR&SPtext=Agriculture%20Land%20Sales"))
insDoc(aux2, gLnk("S", "<font>Agriculture Labour and Size of Holdings</font>", "datasets.aspx?sp=DB_AL&SPtext=Agriculture%20Labour%20and%20Size%20of%20Holdings"))
aux3 = insFld(aux2, gFld("<font>Farm Structure Survey</font>", "javascript:parent.op()"))
insDoc(aux3, gLnk("S", "<font>Farm Structure Survey</font>", "datasets.aspx?sp=DB_FSS&SPtext=Farm%20Structure%20Survey"))
insDoc(aux2, gLnk("S", "<font>Fishing Industry Production and Other Characteristics</font>", "datasets.aspx?sp=DB_AT&SPtext=Fishing%20Industry%20Production%20and%20Other%20Characteristics"))
insDoc(aux2, gLnk("S", "<font>External Trade in Fishing Industry</font>", "datasets.aspx?sp=DB_AU&SPtext=External%20Trade%20in%20Fishing%20Industry"))


aux2 = insFld(aux1, gFld("<font>Industry</font>", "javascript:parent.op()"))
aux4 = insFld(aux2, gFld("<font>Census of Industrial Production</font>", "javascript:parent.op()"))
insDoc(aux4, gLnk("S", "<font>Census of Industrial Production</font>", "datasets.aspx?sp=DB_AI&SPtext=Census%20of%20Industrial%20Production"))

//    insDoc(aux4, gLnk("S", "<font>Local Units - Industrial</font>", "../../Database/eirestat/Local Units Industrial/Local Units Industrial_statbank.asp?SP=Local Units Industrial&Planguage=0"))
//    insDoc(aux4, gLnk("S", "<font>Local Units - Manufacturing</font>", "../../Database/eirestat/Local Units Manufacturing/Local Units Manufacturing_statbank.asp?SP=Local Units Manufacturing&Planguage=0"))
//    insDoc(aux4, gLnk("S", "<font>Enterprises - Industrial</font>", "../../Database/eirestat/Enterprises Industrial/Enterprises Industrial_statbank.asp?SP=Enterprises Industrial&Planguage=0"))
//    insDoc(aux4, gLnk("S", "<font>Enterprises - Manufacturing</font>", "../../Database/eirestat/Enterprises Manufacturing/Enterprises Manufacturing_statbank.asp?SP=Enterprises Manufacturing&Planguage=0"))
//    insDoc(aux4, gLnk("S", "<font>Census of Industrial Production - Nace 70</font>", "../../Database/eirestat/Census of Industrial Production Nace 70/Census of Industrial Production Nace 70_statbank.asp?SP=Census of Industrial Production Nace 70&Planguage=0"))

//   insDoc(aux2, gLnk("S", "<font>Prodcom Statistics</font>", "../../Database/eirestat/Prodcom Statistics/Prodcom Statistics_statbank.asp?SP=Prodcom Statistics&Planguage=0"))



insDoc(aux2, gLnk("S", "<font>Industrial Production Volume and Turnover Indices</font>", "datasets.aspx?sp=DB_MI&SPtext=Industrial%20Production%20Volume%20and%20Turnover%20Indices"))
//insDoc(aux2, gLnk("S", "<font>Industrial Production Volume and Turnover Indices - Electricity</font>", "../../Database/eirestat/Industrial Production Volume and Turnover Indices Electricity/Industrial Production Volume and Turnover Indices Electricity_statbank.asp?SP=Industrial Production Volume and Turnover Indices - Electricity&Planguage=0"))



insDoc(aux2, gLnk("S", "<font>Capital Disposals and Acquisitions in Industry</font>", "datasets.aspx?sp=DB_QD&SPtext=Capital%20Disposals%20and%20Acquisitions%20in%20Industry"))
insDoc(aux2, gLnk("S", "<font>Earnings Employment and Productivity in Industry</font>", "datasets.aspx?sp=DB_QI&SPtext=Earnings Employment and Productivity in Industry"))
insDoc(aux2, gLnk("S", "<font>Industrial Stocks</font>", "datasets.aspx?sp=DB_QS&SPtext=Industrial Stocks"))


aux2 = insFld(aux1, gFld("<font>Construction</font>", "javascript:parent.op()"))
insDoc(aux2, gLnk("S", "<font>Enterprise Statistics on Construction</font>", "datasets.aspx?sp=DB_BA&SPtext=Annual%20Enterprise%20Statistics%20on%20Building%20and%20Construction"))
insDoc(aux2, gLnk("S", "<font>Planning Permissions</font>", "datasets.aspx?sp=DB_BH&SPtext=Planning%20Permissions"))
insDoc(aux2, gLnk("S", "<font>Production in Building and Construction Index</font>", "datasets.aspx?sp=DB_BE&SPtext=Production%20in%20Building%20and%20Construction%20Index"))

insDoc(aux2, gLnk("S", "<font>Earnings and Hours Worked in Construction</font>", "datasets.aspx?sp=DB_BD&SPtext=Earnings and Hours Worked in Construction"))
insDoc(aux2, gLnk("S", "<font>Index of Employment in Construction</font>", "datasets.aspx?sp=DB_BB&SPtext=Index of Employment in Construction"))
insDoc(aux2, gLnk("S", "<font>Quantity Surveyors Inquiry 1987 to 1998</font>", "datasets.aspx?sp=DB_BF&SPtext=Quantity%20Surveyors%20Inquiry%201987%20to%201998"))
insDoc(aux2, gLnk("S", "<font>Cement Sales and Imports 1977 to 1996</font>", "datasets.aspx?sp=DB_BG&SPtext=Cement%20Sales%20and%20Imports%20(1977-1996)"))


aux2 = insFld(aux1, gFld("<font>Services</font>", "javascript:parent.op()"))
insDoc(aux2, gLnk("S", "<font>Enterprise Statistics on Financial Sector</font>", "datasets.aspx?sp=DB_IB&SPtext=Enterprise%20Statistics%20on%20Financial%20Sector"))

insDoc(aux2, gLnk("S", "<font>Enterprise Statistics on Distribution and Services</font>", "datasets.aspx?sp=DB_AN&SPtext=Enterprise Statistics on Distribution and Services"))

aux3 = insFld(aux2, gFld("<font>Retail Sales</font>", "javascript:parent.op()"))
insDoc(aux3, gLnk("S", "<font>Retail Sales - Annual and Monthly Series</font>", "datasets.aspx?sp=DB_RS&SPtext=Retail Sales - Annual and Monthly Series"))
//insDoc(aux3, gLnk("S", "<font>Retail Sales - Monthly Series</font>", "datasets.aspx?sp=DB_RS&SPtext=Retail Sales - Annual Series"))
insDoc(aux2, gLnk("S", "<font>Services Index</font>", "datasets.aspx?sp=DB_MS&SPtext=Services Index"))
insDoc(aux2, gLnk("S", "<font>Earnings in Distribution and Business Services</font>", "datasets.aspx?sp=DB_QE&SPtext=Earnings in Distribution and Business Services"))



aux2 = insFld(aux1, gFld("<font>Transport</font>", "javascript:parent.op()"))
insDoc(aux2, gLnk("S", "<font>Maritime Statistics</font>", "datasets.aspx?sp=DB_TB&SPtext=Maritime Statistics"))
insDoc(aux2, gLnk("S", "<font>Rail Statistics</font>", "datasets.aspx?sp=DB_TC&SPtext=Rail Statistics"))
insDoc(aux2, gLnk("S", "<font>Road Freight Statistics</font>", "datasets.aspx?sp=DB_TF&SPtext=Road Freight Statistics"))
insDoc(aux2, gLnk("S", "<font>Road Traffic Volumes</font>", "datasets.aspx?sp=DB_TH&SPtext=Road%20Traffic%20Volumes"))

insDoc(aux2, gLnk("S", "<font>Vehicle Registration Statistics - Annual and Monthly Series</font>", "datasets.aspx?sp=DB_TD&SPtext=Vehicle Registration Statistics - Annual and Monthly Series"))
insDoc(aux2, gLnk("S", "<font>Vehicle Licensing Statistics - Annual and Monthly Series</font>", "datasets.aspx?sp=DB_TE&SPtext=Vehicle Licensing Statistics - Annual and Monthly Series"))

//aux3 = insFld(aux2, gFld("<font>Vehicle Registration Statistics - Annual and Monthly Series</font>", "javascript:parent.op()"))
// insDoc(aux3, gLnk("S", "<font>Vehicle Registration Statistics - Annual and Monthly Series</font>", "datasets.aspx?sp=DB_TD&SPtext=Vehicle Registration Statistics - Annual and Monthly Series"))
// insDoc(aux3, gLnk("S", "<font>Vehicle Registrations Statistics - Monthly Series</font>", "../../Database/eirestat/Vehicle Registrations Statistics Monthly Series/Vehicle Registrations Statistics Monthly Series_statbank.asp?SP=Vehicle Registrations Statistics Monthly Series&Planguage=0"))


// aux4 = insFld(aux2, gFld("<font> Vehicle Licensing Statistics - Annual and Monthly Series</font>", "javascript:parent.op()"))
// insDoc(aux4, gLnk("S", "<font>Vehicle Licensing Statistics - Annual & Monthly Series</font>", "datasets.aspx?sp=DB_TE&SPtext=Vehicle%20Licensing"))
//insDoc(aux4, gLnk("S", "<font>Vehicle Licensing Statistics - Monthly Series</font>", "../../Database/eirestat/Vehicle Licensing Statistics Monthly Series/Vehicle Licensing Statistics Monthly Series_statbank.asp?SP=Vehicle Licensing Statistics Monthly Series&Planguage=0"))

insDoc(aux2, gLnk("S", "<font>Aviation Statistics</font>", "datasets.aspx?sp=DB_TA&SPtext=Aviation Statistics"))








aux2 = insFld(aux1, gFld("<font>Tourism and Travel</font>", "javascript:parent.op()"))
insDoc(aux2, gLnk("S", "<font>Tourism and Travel - Annual and Quarterly Series</font>", "datasets.aspx?sp=DB_TM&SPtext=Tourism and Travel - Annual and Quarterly Series"))
// insDoc(aux2, gLnk("S", "<font>Tourism and Travel - Quarterly Series</font>", "../../Database/eirestat/Tourism and Travel Quarterly Series/Tourism and Travel Quarterly Series_statbank.asp?SP=Tourism and Travel Quarterly Series&Planguage=0"))
insDoc(aux2, gLnk("S", "<font>Overseas Travel</font>", "datasets.aspx?sp=DB_TM&SPtext=Overseas Travel"))
insDoc(aux2, gLnk("S", "<font>Household Travel Survey</font>", "datasets.aspx?sp=DB_HT&SPtext=Household%20Travel%20Survey"))
insDoc(aux2, gLnk("S", "<font>Passenger Movement and Airport Pairings</font>", "datasets.aspx?sp=DB_CT&SPtext= Passenger Movement and Airport Pairings"))

aux2 = insFld(aux1, gFld("<font>Science and Technology</font>", "javascript:parent.op()"))
insDoc(aux2, gLnk("S", "<font>Business Expenditure on Research and Development</font>", "datasets.aspx?sp=DB_BS&SPtext=Business%20Expenditure%20on%20Research%20and%20Development"))

insDoc(aux2, gLnk("S", "<font>Innovation in Irish Enterprises - All Sectors</font>", "datasets.aspx?sp=DB_CI&SPtext=Innovation in Irish Enterprises - All Sectors"))


//aux4 = insFld(aux2, gFld("<font>Innovation in Irish Enterprises</font>", "javascript:parent.op()"))
//insDoc(aux4, gLnk("S", "<font>Innovation in Irish Enterprises - All sectors</font>", "datasets.aspx?sp=DB_CI&SPtext=Innovation%20in%20Irish%20Enterprises"))
aux1 = insFld(foldersTree, gFld("<font>Sustainable Development Goals</font>", "javascript:parent.op()"))
aux2 = insFld(aux1, gFld("<font>Goal 1 - No Poverty</font>", "datasets.aspx?sp=DB_SD01&SPtext=Goal 1 - No Poverty"))

aux1 = insFld(foldersTree, gFld("<font>Public Sector Statistics Network</font>", "javascript:parent.op()"))
aux2 = insFld(aux1, gFld("<font>Department of Education and Skills</font>", "datasets.aspx?sp=DB_ED&SPtext=Department of Education and Skills"))
aux2 = insFld(aux1, gFld("<font>Irish Maritime Development Office</font>", "datasets.aspx?sp=DB_IMDO&SPtext=Irish%20Maritime%20Development%20Office"))
aux2 = insFld(aux1, gFld("<font>Sustainable Energy Authority of Ireland</font>", "datasets.aspx?sp=DB_SEI&SPtext=Sustainable Energy Authority of Ireland"))
aux2 = insFld(aux1, gFld("<font>Residential Tenancies Board (RTB)</font>", "datasets.aspx?sp=DB_RI&SPtext=Residential%20Tenancies%20Board%20(PRTB)"))
aux2 = insFld(aux1, gFld("<font>Health Research Board</font>", "datasets.aspx?sp=DB_HR&SPtext=Health%20Research%20Board"))
aux2 = insFld(aux1, gFld("<font>Department of Housing, Planning, Community and Local Government</font>", "datasets.aspx?sp=DB_HS&SPtext=Department of Housing, Planning, Community and Local Government"))
aux2 = insFld(aux1, gFld("<font>National Roads Authority</font>", "datasets.aspx?sp=DB_NRA&SPtext=National Roads Authority"))
aux2 = insFld(aux1, gFld("<font>Revenue Transport Statistics</font>", "datasets.aspx?sp=DB_RCT&SPtext=Revenue Transport Statistics"))
aux2 = insFld(aux1, gFld("<font>Income Tax and Corporation Tax Distribution Statistics</font>", "datasets.aspx?sp=DB_RV01&SPtext=Income Tax and Corporation Tax Distribution Statistics"))
aux2 = insFld(aux1, gFld("<font>Road Safety Authority of Ireland Statistics</font>", "datasets.aspx?sp=DB_RSA&SPtext=Road Safety Authority of Ireland Statistics"))
aux2 = insFld(aux1, gFld("<font>Department of Health</font>", "datasets.aspx?sp=DB_DH&SPtext=Department of Health"))
aux2 = insFld(aux1, gFld("<font>Department of Agriculture Food and the Marine</font>", "datasets.aspx?sp=DB_DA&SPtext=Department of Agriculture Food and the Marine"))



//        insDoc(aux4, gLnk("S", "<font>IIE-Nace Sector</font>", "datasets.aspx?sp=DB_CI&SPtext=Health%20Research%20Board"))
//        insDoc(aux4, gLnk("S", "<font>IIE-Persons Engaged</font>", "datasets.aspx?sp=DB_CI&SPtext=Health%20Research%20Board"))
//        insDoc(aux4, gLnk("S", "<font>IIE-Nationality of Ownership</font>", "datasets.aspx?sp=DB_CI&SPtext=Health%20Research%20Board"))
//        insDoc(aux4, gLnk("S", "<font>IIE-Other Business Indicators</font>", "datasets.aspx?sp=DB_CI&SPtext=Health%20Research%20Board"))
//        insDoc(aux4, gLnk("S", "<font>IIE-European Statistics</font>", "datasets.aspx?sp=DB_CI&SPtext=Health%20Research%20Board"))
//        insDoc(aux4, gLnk("S", "<font>IIE-First Findings</font>", "datasets.aspx?sp=DB_CI&SPtext=Health%20Research%20Board"))
