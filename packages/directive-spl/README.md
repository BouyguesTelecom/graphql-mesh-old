# Simple Predicate Langage (SPL)

### Introduction
SPL is a very small, lightweight, straightforward and non-evaluated expression language to sort, filter and paginate arrays of maps.

### Grammar
See [SPL.g4 file](./src/main/antlr/SPL.g4)

### Examples

Given this simple dataset:

```
final List<Map<String, Object>> dataset = Arrays.asList(Map.of(
        "firstName", "Martin",
        "lastName", "Dupont",
        "age", 21,
        "address": {
          "country": "France",
          "town": "Paris"
        }
), Map.of(
        "firstName", "Bertrand",
        "lastName", "Dupont",
        "age", 17,
        "address": {
          "country": "South Korea",
          "town": "Seoul"
        }
), Map.of(
        "firstName", "Michel",
        "lastName", "Dupond",
        "age", 19,
        "address": {
          "country": "France",
          "town": "Toulouse"
        }
));
```
The following expressions can be applied using SPL:

#### Filters

##### Simple filtering
```
lastName = 'Dupont'
```

##### Binary operators
```
(firstName = 'Seb') AND (lastName = 'Dupont')
```

##### Array search
```
(firstName IN ['Seb', 'Paul', 'Jean']) OR (lastName = 'Dupont')
```

##### Inject fields anywhere
```
(givenName IN [firstName, lastName]) OR (lastName = 'Dupont')
```

##### Inject variables anywhere
```
(givenName IN [:variable1, :variable2]) OR (lastName = :variable3)
```

##### Deep search
```
address.country = 'France'
```


#### Sort
```
SORT BY firstName ASC, lastName DESC
```

#### Pagination
```
LIMIT 0, 100
```
