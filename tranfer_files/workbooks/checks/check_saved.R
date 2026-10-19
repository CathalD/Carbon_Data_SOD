# Run from workbooks/r: Rscript ../checks/check_saved.R
# Uses the pinned report statistics as an external numerical reference.
source('helpers.R')
reference <- read_input('comparison_statistics.csv')
for (id in pairs$id) {
 p <- pair_spec(id); d <- eligible(get_pair_samples(p,'saved'),p); s <- summarise_values(d$a,d$b)
 r <- reference[reference$id==id,names(s)]
 stopifnot(isTRUE(all.equal(as.numeric(s[1,]),as.numeric(r[1,]),tolerance=1e-11)))
}
stopifnot(nrow(pairs)==17L, all(c(pairs$a,pairs$b)%in%products$key), !anyDuplicated(products$key))
s <- summarise_values(c(0,1,NA),c(0,1,2)); stopifnot(s$n==2, s$mean_diff==0,s$rmsd==0,s$within_25pct==1)
stopifnot(is.na(safe_cor(rep(1,3),1:3)), summarise_values(numeric(),numeric())$n==0)
cat('All 17 saved comparisons match published statistics; zero, missing and constant-value cases pass.\n')
