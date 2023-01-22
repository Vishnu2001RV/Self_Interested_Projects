# **Project Tractor**

# IF deployed the app in any server

## `do edit the .env file to add the base url so that there no CORS issues. (if local server then hide REACT_APP_BASE_URL variable in .env)`

**Part 1:- (Only Tractors)**

**Problem-Statement:-** Farmers find it difficult to buy tractors or fix their existing one( but need to complete the cropping in that season itself).

**Our solution :-** We would like to help them by connecting them properly with drivers and renters.

1. From this we help farmers to plough their fields effortlessly without them searching for their machines and tools.
2. We help the drivers who would like a part-time job 1
3. We also help the renters who rent their machines
4. Their machine continuously so that problems without using the machines are eliminated
5. They also earn from their renting

**Need more clarity on:-**

1. Transport of vehicles (like we provide support or the farmers need to pay for that)
2. Drivers Accommodation(For long distance drivers) 
```diff
+ ( SOLVED :- Should be provided by farmers)
```
4. Drivers travel fees 
```diff
+ ( SOLVED :- Should be provided by farmers(Mostly local drivers))
```
6. Will the point 1 ie Transport and accomodation be feasible for farmers or will the overall cost be even higher when compared to buying a tractor(in long term)
7. What happens if either the driver is disappointed with accomodation and leaves the farmers. (Farmers still can't plow)
8. Will this problem cost the farmer to just lose his money if not refunded by the driver.
9. If the tractor rented is not working will there be a refund to the farmer as soon as possible. and will he get a replacement.
10. How will the pricing be fixed? Based on time or fuel or area of the land?
11. Drivers pay criteria.
12. What happens if the tractor is repaired before ploughing begins? 
```diff
- ( ON\_RESEARCH :- Driver to fill the form about the condition of the tractor (Might need to verify if driver is saying truth if renter is the driver) )
```
14. Should the driver or farmer pay for the tractor if broken during the 3 days?

**User Requirements**

1. **Farmers\_Requirements**
   1. I need a tractor to plow my remaining field, as my tractor is in repair( Needs Immedeiately to complete the work) (2-cases : with or without driver)
   2. I need a driver to drive my tractor.(3 days)(Will provide accomodation)
2. **Drivers Requirement**
   1. Need Accomodation
   2. Need daily payment. ( We can use Google Pay API for this)
3. **Renters Requirement**
   1. Need to get back the machine on time
   2. Need monthly payment. (Daily will also be good)
   3. Need for clarity Point 1 applies

**Approach:- (Technical)**

1. Payment will be done in Google Pay.
2. We will start using React. Might change to some other framework if needed.
3. Possible option for database:-
4. MongoDb
5. Google Firebase (Provide other support during api&#39;s etc)
6. My SQL

**Part 2:- (Tractors tool extension)**

1. Farmers might also need other type of machine tools to be bought along with tractors.
2. [Eg Tools for Plow](https://www.google.com/search?q=different+type+of+plow&rlz=1C1CHBF_enIN889IN889&tbm=isch&source=iu&ictx=1&fir=Lmqr5DUJFpqnHM%252C98XTor18N9WvzM%252C_&vet=1&usg=AI4_-kRi5TI5bCpOYdXkBmHxY8Ydd0cPIg&sa=X&ved=2ahUKEwjM35Wr76XyAhUtwzgGHfTeCoYQ9QF6BAgREAE#imgrc=Lmqr5DUJFpqnHM)

**Part 3:- ( Other tools)**

1. **Tools other than tractor**
