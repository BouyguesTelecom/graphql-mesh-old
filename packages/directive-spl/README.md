# Simple Predicate Langage

## Introduction
This is a very small, lightweight, straightforward and non-evaluated expression language to sort, filter and paginate arrays of maps.

### Grammar
See [SPL.g4 file](./src/main/antlr/SPL.g4)

### Examples
Given this simple dataset :

```
final List<Map<String, Object>> dataset = Arrays.asList(Map.of(
        "firstName", "Martin",
        "lastName", "Dupont",
        "age", 21
), Map.of(
        "firstName", "Bertrand",
        "lastName", "Dupont",
        "age", 17
), Map.of(
        "firstName", "Michel",
        "lastName", "Dupond",
        "age", 19
));
```
#### Filtering
Simple filtering :
```
name = 'Dupont'
```

Binary operators :
```
(firstName = 'Seb') AND (lastName = 'Dupont')
```

Array search support :
```
(firstName IN ['Seb', 'Paul', 'Jean']) OR (lastName = 'Dupont')
```

Inject fields anywhere:
```
(givenName IN [firstName, secondName, thirdName]) OR (lastName = 'Dupont')
```

Inject variables anywhere:
```
(givenName IN [:variable1, :variable2]) OR (lastName = :variable3)
```

Deep searching
```
("names.firt" = "jean")
```


#### Sorting
```
SORT BY firstName ASC, lastName DESC
```

#### Pagination
```
LIMIT 0, 100
```
