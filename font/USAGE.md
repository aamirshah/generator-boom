Fonts
============
We can add new fonts any time we want.




Command Usage
-------
To add a new ***font*** use:
    

Example:
```
    $ yo boom:font arial
```

This will add:

```
    @font-face { 
		font-family: 'arial'; 
		src: url('../fonts/arial/arial.eot'); /* IE9 Compat Modes */ 
		src: url('../fonts/arial/arial.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */ 
			url('../fonts/arial/arial.woff') format('woff'), /* Modern Browsers */ 
			url('../fonts/arial/arial.ttf')  format('truetype'), /* Safari, Android, iOS */ 
			url('../fonts/arial/arial.svg#svgFontName') format('svg'); /* Legacy iOS */ 
	}
```
in app/css/fonts.css

```
    $ yo boom:style file_name -scss
```

Also a empty directory will be created :
 
 > app/fonts/arial/



		
