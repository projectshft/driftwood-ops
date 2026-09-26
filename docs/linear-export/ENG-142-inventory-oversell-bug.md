# ENG-142: Inventory oversell under concurrent orders

**Status:** Open
**Assignee:** Priya Nair
**Reported by:** Dana Osei (via SUP-48)
**Priority:** Medium (workaround exists)

## Description

Dana's team has seen a handful of cases where two orders both went
through for the last unit of a low-stock item, resulting in oversold
inventory. Warehouse ends up short and has to call the customer to delay
or substitute.

Happens rarely - only when two orders for the same product/warehouse hit
within a very short window - but it's happened at least 4 times this
quarter, all on Nimbus Snacks' fast-moving SKUs.

## Suspected cause

`checkAvailable` and `reserveStock` in `inventoryService.ts` are two
separate queries with no locking between them. Classic check-then-act
race condition. Under load, two requests can both pass the check before
either one's reservation lands.

## Workaround

Warehouse leads do a manual recount every morning and adjust
`qty_on_hand` via the inventory adjust endpoint. This catches drift but
doesn't prevent the oversell from happening in the first place, and it's
extra manual work every day.

## Fix ideas (not started)

- Wrap check + reserve in a single `UPDATE ... WHERE qty_on_hand -
  qty_reserved >= $qty` and check the row count, instead of a separate
  SELECT then UPDATE
- Or use a postgres advisory lock keyed on (product_id, warehouse_id)
  around the whole reserve operation

Low priority because of the workaround, but the manual recount doesn't
scale if order volume keeps growing the way it has been.
