View (HTML)
============
We can add View (HTML) files any time we want.




Command Usage
-------
To add a new ***view***  use:
    

Example:
```
    $ yo boom:view file_name
```

This will create:
    > app/css/file_name.css

```
    $ yo boom:style file_name -scss
```

This will create:
 
> app/template/file_name.html
> app/css/file_name.css
> app/js/controllers/file_name.css


```
    $ yo boom:view file_name -c
```

This will skip the controller creation.


```
    $ yo boom:view file_name -css
```

This will skip the style file creation.
