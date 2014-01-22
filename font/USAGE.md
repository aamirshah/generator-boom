Fonts
============
We can add new fonts any time we want.




Command Usage
-------
   
***Example***

```
    $ yo boom:font arial
```

This will add:

```    
	@font-face { 
		font-family: 'arial'; 
		src: url('../fonts/arial/arial.eot'); /* IE9 Compat Modes */ 
		src: local('☺'), 
			url('../fonts/arial/arial.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */ 
			url('../fonts/arial/arial.woff') format('woff'), /* Modern Browsers */ 
			url('../fonts/arial/arial.ttf')  format('truetype'), /* Safari, Android, iOS */ 
			url('../fonts/arial/arial.svg#svgFontName') format('svg'); /* Legacy iOS */ 
		font-weight: 'normal'; 
		font-style: 'normal'; 
	}
```
in `app/css/fonts.css`


Also a empty directory will be created :

```
    app/fonts/arial/
```


		
