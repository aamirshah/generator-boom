View (HTML)
============
We can add View (HTML) files any time we want.




Command Usage
-------
    

***Example***

```
    $ yo boom:view file_name
```

This will create:

```
    app/css/file_name.css
```    

To add a scss file 

```
    $ yo boom:style file_name -scss
```

This will create:

````							 
	app/template/file_name.html
	app/css/file_name.css
	app/js/controllers/file_name.js
```

To skip adding the controller

```
    $ yo boom:view file_name -c
```


To skip adding the style file

```
    $ yo boom:view file_name -css
```


