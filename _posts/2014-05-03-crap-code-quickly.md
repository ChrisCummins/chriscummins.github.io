---
layout: default
title: On writing crap code, quickly
---

I was recently given a programming aptitude test as part of an
interview process. The task was to write a *reverse* function for a
singly linked list. For those unfamiliar, it should look something
like this:

```js
var reverse = function(head) {
  var current = head, next, previous = null;

  while (current) {
    next = current.next;
    current.next = previous;
    previous = current;
    current = next;
  }

  return previous;
};
```

Simple enough. It iterates over the list from front to back, keeping
track of the current node, the node which comes after it, and the node
which came before it. For each node, it sets the next node to be the
previous node in the list. When the loop terminates, the list has been
reversed.

When posed this problem, I knew I was under the scrutiny of potential
employers, and this anxiety caused my logical mind to quickly fart its
way through a rapid succession of doubts:

> "OK. This is a simple problem, no sweat."<br/>
> "Wait... how do I do it?"<br/>
> "Ah *shit*, my CS theory is rusty!"<br/>
> "No time for a cheeky stack overflow browse, right?"<br/>
> "OK enough stalling, let's start typing!"

And this was the solution I came up with:

```js
var reverse = function(node) {
  var n = node, arr = [];

  while (n) {
    if (n.next) {
      arr.push(n);
      n = n.next;
    } else {
      arr = arr.reverse();
      n.next = arr[0];

      for (var i = 0; i < arr.length - 1; i++) {
        var node = arr[i];
        var next = arr[i + 1];

        node.next = next;
      }

      arr[arr.length - 1].next = null;
      return n;
    }
  }
};
```

So, by ways of a quick analysis of the solution: it's crap. Here's
three of the most significant reasons:

1. It's harder to read, longer, and contains three levels of nested
   logic, as opposed to the reference solution's 1.
2. It iterates over every element, and then iterates over every
   element except the last *again*. So while it is still *O(n)* in
   time complexity, it's *2n-1* rather than the *n* of the reference
   solution, so really it's **twice as slow**.
3. It uses an auxiliary data structure (an array) to store *n-1*
   nodes, so it's *O(n)* in space complexity, instead of the *O(1)* of
   the reference solution. This is the real red flag: if an operation
   on a data structure requires you to create an entirely new data
   structure, it's **probably not a well thought-out operation**.

And "well thought out" it was definitely not. I took at most a minute
or two to come up with the solution, and in retrospect it is clear to
see that by trying to ensure that I came up with something as fast as
possible, I lost sight of whether the solution I was working on was
*good* or not.


##### What can I learn from this?

The reason I found this experience interesting and worth reflecting
upon was that it seemed to reflect a mistake that I'll often find
myself repeating: I'll start writing before I have a good idea of what
it is I should be writing. In software, this leads to spaghetti code
and multiple re-writes. As the ever excellent and bastion of cynicism
[xkcd](http://xkcd.com/844/) explains:

![XKCD](http://imgs.xkcd.com/comics/good_code.png)

It seems that all of this ultimately boils down to a rephrasing of the
old adage:
*[make it work, make it right, make it fast](http://c2.com/cgi/wiki?MakeItWorkMakeItRightMakeItFast)*.
