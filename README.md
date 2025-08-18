i am working on my app !
which is working super now !

just one last issue see !

soo see i have this special component SortableTable !

which we r using at many places.... many pages !
i shared 2 pages as example too !

but but !
we are using this component at many places !

so any change ... !
it should be dont only in the component !
... not in any pages !

so update i want is.... !
without disorting any fucntionalities... UI... postions... anything !

i wana place a pagination kinda thing !

so lets say !
user select top : 20 !
so now we will only show 20... and order by the sorter  !

and by pagination i do not mean ... page 1,2,... !

no no !

only first top 20 based on sorted !

like lest say !
a certain column as sorter and right now assending !
so show top 20 sorted in assecding order by that column !

if we toggle the sort !
now show top 20 in desecding order by that column !
so some values might be missing in first case (as they will go in last and we only show top 20)
and they can be seen in second case !
so thats okay !

so two things !
impliment this !
user can choose btwn 5,10,20,30,50, all ! 

and that also without breaking the UI 
or ... uk
still keeping it ass good as it always was !

and only only update the SortableTable.jsx !

-----------------------------------------------------------------