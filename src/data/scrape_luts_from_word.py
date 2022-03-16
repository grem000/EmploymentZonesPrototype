from docx2python import docx2python
import json
import os

# todo: Loop over aall files in the dir. 
#  
# extract docx content
# doc_result = docx2python('word_docs/Albury.docx')
# doc_result = docx2python('word_docs/Blacktown.docx')
# doc_result = docx2python('word_docs/Eurobodalla.docx')

allLandUseTerms = ["Advertising structures ","Agricultural produce industries ","Agriculture ","Air transport facilities ","Airports ","Airstrips ","Amusement centres ","Animal boarding or training establishments ","Aquaculture ","Artisan food and drink industries ","Attached dwellings ","Backpackers’ accommodation ","Bed and breakfast accommodation ","Bee keeping ","Biosolids treatment facilities ","Boarding houses ","Boat building and repair facilities ","Boat launching ramps ","Boat sheds ","Building identification signs ","Business identification signs ","Business premises ","Camping grounds ","Car parks ","Caravan parks ","Cellar door premises ","Cemeteries ","Centre-based child care facilities ","Charter and tourism boating facilities ","Co-living housing ","Commercial premises ","Community facilities ","Correctional centres ","Creative industries ","Crematoria ","Dairies (pasture-based) ","Dairies (restricted) ","Data centres ","Depots ","Dual occupancies ","Dual occupancies (attached) ","Dual occupancies (detached) ","Dwelling houses ","Early education and care facilities ","Eco-tourist facilities ","Educational establishments ","Electricity generating works ","Emergency services facilities ","Entertainment facilities ","Environmental facilities ","Environmental protection works ","Exhibition homes ","Exhibition villages ","Extensive agriculture ","Extractive industries ","Farm buildings ","Farm stay accommodation ","Feedlots ","Flood mitigation works ","Food and drink premises ","Forestry ","Freight transport facilities ","Function centres ","Funeral homes ","Garden centres ","General industries ","Goods repair and reuse premises ","Group homes ","Group homes (permanent) or permanent group homes ","Group homes (transitional) or transitional group homes ","Hardware and building supplies ","Hazardous industries ","Hazardous storage establishments ","Health consulting rooms ","Health services facilities ","Heavy industrial storage establishments ","Heavy industries ","Helipads ","Heliports ","High technology industries ","Highway service centres ","Home-based child care ","Home businesses ","Home industries ","Home occupations ","Home occupations (sex services) ","Horticulture ","Hospitals ","Hostels ","Hotel or motel accommodation ","Independent living units ","Industrial retail outlets ","Industrial training facilities ","Industries ","Information and education facilities ","Intensive livestock agriculture ","Intensive plant agriculture ","Jetties ","Kiosks ","Landscaping material supplies ","Light industries ","Liquid fuel depots ","Livestock processing industries ","Local distribution premises ","Marinas ","Markets ","Medical centres ","Mooring pens ","Moorings ","Mortuaries ","Multi dwelling housing ","Neighbourhood shops ","Neighbourhood supermarkets ","Offensive industries ","Offensive storage establishments ","Office premises ","Open cut mining ","Oyster aquaculture ","Passenger transport facilities ","Pig farms ","Places of public worship ","Plant nurseries ","Pond-based aquaculture ","Port facilities ","Poultry farms ","Public administration buildings ","Pubs ","Recreation areas ","Recreation facilities (indoor) ","Recreation facilities (major) ","Recreation facilities (outdoor) ","Registered clubs ","Research stations ","Residential accommodation ","Residential care facilities ","Residential flat buildings ","Resource recovery facilities ","Respite day care centres ","Restaurants or cafes ","Restricted premises ","Retail premises ","Roads ","Roadside stalls ","Rural industries ","Rural supplies ","Rural workers’ dwellings ","Sawmill or log processing works ","School-based child care ","Schools ","Secondary dwellings ","Self-storage units ","Semi-detached dwellings ","Seniors housing ","Service stations ","Serviced apartments ","Sewage reticulation systems ","Sewage treatment plants ","Sewerage systems ","Sex services premises ","Shops ","Shop top housing ","Signage ","Small bars ","Specialised retail premises ","Stock and sale yards ","Storage premises ","Take away food and drink premises ","Tank-based aquaculture ","Timber yards ","Tourist and visitor accommodation ","Transport depots ","Truck depots ","Turf farming ","Vehicle body repair workshops ","Vehicle repair stations ","Vehicle sales or hire premises ","Veterinary hospitals ","Viticulture ","Warehouse or distribution centres ","Waste disposal facilities ","Waste or resource management facilities ","Waste or resource transfer stations ","Water recreation structures ","Water recycling facilities ","Water reticulation systems ","Water storage facilities ","Water supply systems ","Water treatment facilities ","Wharf or boating facilities ","Wholesale supplies"]


def formatObjectives(objectives):
    return   objectives.replace("1 Objectives of zone ","").replace("\u2019","'").replace("--\t","<br>").strip()

def splitUses(usesString):
    stripped = usesString.replace(" 2 Permitted without consent","").replace(" 3 Permitted with consent","").replace(" 4 Prohibited Agriculture","").strip().replace("\u2019","'")
    usesArray = stripped.split(';')
    # expand group terms
    # scan for " Any other development not specified in item 2 or 4" abd replace will expanded list of terms not in 2 or 4.

    # format to (use formatting for objectives too)
    #       replaceace --\t with <BR> 
    #       Do something with \u202
    #       others? 
        
    
    return [x.strip() for x in usesArray if x]

def expandOpenZone(permittedWithout,permittedWith,prohibited):
    if permittedWith[-1].strip() == "Any other development not specified in item 2 or 4":
        for term in allLandUseTerms:
            if term not in permittedWithout and  term not in permittedWith and term not in prohibited:
                permittedWith.append(term)
    return permittedWith

def scrape(doc_result):
    zone=""
    objectives = ""
    permittedWithout=""
    permittedWith=""
    prohibited=""
    scanningFor = "LEP"
    # scanningFor = "Objectives of zone"

    # print("doc_result.body[0][2][0][1]",doc_result.body[0][2][0][1])
    if  len(doc_result.body[0][2][0][1]) < 5 :
        lep = doc_result.body[0][2][0][2]
    else:
        lep = doc_result.body[0][2][0][1]
        
    # print(lep)
    # print("doc_result.body[0][2][0]",doc_result.body[0][2][0])
    

    for (i,frag) in enumerate(doc_result.body[0][2][0]):
        # print(i,scanningFor , frag.strip()[:4])
        if ( scanningFor == "LEP"): # throw away direction and guidance
            if len(frag) >2:
                lep=frag
                scanningFor="ZONE"
        elif ( scanningFor == "ZONE"): # throw away direction and guidance
            if len(frag) >2:
                zone=frag
                scanningFor= "1 Objectives of zone"
        # if i == 3 :
        #     zone = frag
        #     scanningFor = "1 Objectives of zone"
        if ( scanningFor == "1 Objectives of zone"): # throw away direction and guidance
            if frag.strip() == scanningFor:
                scanningFor = "2 Permitted without consent"
                # print("Boundary" ,frag)
        if ( scanningFor == "2 Permitted without consent"):
            if frag.strip() == scanningFor:
                scanningFor = "3 Permitted with consent"
                # print("Boundary" ,frag)
            else:
                objectives = objectives +" " +frag
        if ( scanningFor == "3 Permitted with consent"):
            if frag.strip() == scanningFor:
                scanningFor = "4 Prohibited"
                # print("Boundary" ,frag)
            else:
                permittedWithout = permittedWithout +" " +frag
        if ( scanningFor == "4 Prohibited"):
            if frag.strip() == scanningFor:
                scanningFor = "Zone"
                # print("Boundary" ,frag)
            else:
                permittedWith = permittedWith +" " +frag
        if ( scanningFor == "Zone"):
            if ((frag.strip()[:4] == scanningFor )or (frag.startswith("Local Provisions and Schedule 1")) or (i == (len(doc_result.body[0][2][0])-1 )) ):
                scanningFor = "1 Objectives of zone"
                # print("Boundary" ,frag)
                # print()
                # print("lep=",lep)
                # print("zone=",zone)

                # print(objectives)
                # print(permittedWithout)
                # print(permittedWith)
                # print(prohibited)
                luts.append({"LEP":lep,"zone":zone,"objectives":formatObjectives(objectives),"permittedWithout":splitUses(permittedWithout),"permittedWith":splitUses(permittedWith),"prohibited":splitUses(prohibited)})
                zone=frag
                objectives=""
                permittedWithout=""
                permittedWith=""

                prohibited=""

            else:
                prohibited = prohibited +" " +frag


# print("zone count",len(luts))
# print(luts[0]['LEP'])
# print([s['zone'] for s in luts  ])
# print(zone,objectives,permittedWithout,permittedWith,prohibited)

    # scan until 1 Objectives of zone'
    # store in objective until  "2 permitted without consent"
    # store in X until  "3 permitted with consent"
    # store in X until  "4 Prohibited"
    # store in X until  "Zone XX"


global luts
luts = []

directory = os.fsencode("./word_docs")
    
for file in os.listdir(directory):
     filename = os.fsdecode(file)
     if filename.endswith(".docx"): 
        #  print()
        #  print( filename)
        #  doc_result = docx2python('word_docs/Ku-ring-gai.docx')
         doc_result = docx2python('word_docs/'+filename)
         scrape(doc_result)
         continue
     else:
         continue

# filename="Griffith LEP 2014 LUTs Preliminary Translation - Version 2.0.docx"
# doc_result = docx2python('word_docs/'+filename)
# scrape(doc_result)
# print(luts)
print (json.dumps(luts))
# print(luts[0].LEP)