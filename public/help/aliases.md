
alias                                    |   name                                      | AP | SA | GA | AM | issue     | comment
-----------------------------------------+---------------------------------------------+----+----+----+----+-----------+--------------------
MDA{limit}                               |   moveDownAll                               | X  |    | X  | X  |           |                         
{anyCommand}/MDA{limit}                  |   moveDownAll                               | X  |    | X  | X  |           |                         
PNR                                      |   savePnr                                   | X  | X  | X  | X  |           |                         
SORT                                     |   sortItinerary                             | X  | X  | X  | X  |           |                         
$D*DP3, $D*DF25.00                       |   fareSearchWithDecrease                    | X  |    |    |    |           |                          
$D/mix                                   |   fareSearchMultiPcc                        | X  | X  | X  | X  |           |                         
$BS1+2&$BS3+4                            |   multiPriceItinerary                       | X  | X  | X  | X  |           |                         
STORE{ptc}                               |   storePricing                              | X  | X  | X  | X  |           |                         
PRICE{ptc}                               |   priceAll                                  | X  | X  | X  | X  |           |                         
RE/2CV4/SS2                              |   rebookInPcc                               | X  | X  | X  | X  |           |                          
A/T/20SEPNYCSFO/CHI/ATL/CLT/SEA/MSP+DL   |   multiDstAvail                             | X  |    |    |    |           | likely broken now, I'll check                          
/GK                                      |   rebookAsGk                                | X  |    |    |    |           | rebook all as GK                         
X1-2|3-4/0GK                             |   rebookAsGk                                | X  |    |    |    |           |                          
/SS                                      |   rebookAsSs                                | X  |    |    |    | RSBS-1140 |                                   
/SSE                                     |   rebookAsSs                                | X  |    |    |    | RSBS-1243 | without GK rebook, cuts marriages
$B/+6IIF                                 |   priceInAnotherPcc                         | X  | X  | X  | X  |           |
+3                                       |   rebookWithNewSeatAmount                   | X  | X  | X  | X  |           |
+3S1-3SS                                 |   rebookWithNewSeatAmount                   | X  | X  | X  | X  |           |
II                                       |   ignoreWithoutWarning                      | X  |    |    |    |           | not sure it works...
*HA                                      |   displayHistory                            | X  |    |    |    |           |
{pnrDump}                                |   rebuildFromDump                           | X  | X  | X  | X  |           |
A*O20                                    |   sameMonthReturnAvailability               | X  |    | X  |    |           | should update it to take month from A*20MAY as well
$B/@14                                   |   priceFromTariff                           | X  |    |    |    |           | prices the fare basis on last tariff display at line # 14
FQ/P1.2*C05.3*INF                        |   priceChildrenWithoutNames                 |    |    | X  |    |           | when you want to price multiple PTC-s without names: adds fake names, prices, removes the fake names
AR25JUN                                  |   returnAvailabilityWithOriginalModifiers   |    |    | X  |    | RSBS-1030 | also does not seem to work...
XI                                       |   cancelAllSegments                         |    |    |    | X  |           |
JUM/O-SFO1S2195                          |   fakePccEmulation                          |    |    |    | X  |           |
JMB                                      |   fakeAreaChange                            |    |    |    | X  |           |
-----------------------------------------+---------------------------------------------+----+----+----+----+-----------+--------------------                         
HHMCO                                    |   displayMcoMask                            | X  |    |    |    |           |                                                 
HB:FEX                                   |   displayExchangeMask                       | X  |    |    |    |           |                                                  
HBT                                      |   displayFcMask                             | X  |    |    |    |           |                                               
