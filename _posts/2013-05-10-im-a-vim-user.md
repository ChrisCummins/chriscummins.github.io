---
title: I’m a vim user, get me out of here!
banner: /img/banners/birmingham-4.jpg
---

The Emacs vs. Vim war has grown to Palestine/Israel proportions (in that it it's
a perpetual stalemate that can only be resolved by military intervention), and
there is little common ground between their command sets.

This is all well and good, but can pose a real problem when you're happily
buffering-it-up with your LISP fuelled editor of preference and a vim user comes
over and tries to use your machine.

To avoid the catastrophic repercussions of letting a vim user loose within your
beloved Emacs session, I wrote a small function for my `init.el` which spawns a
new terminal and opens the current file at the exact same place in vim:

```lisp
(defun open-in-vim ()
  "Opens the current file in vim."
  (interactive)
  (if (not (equal buffer-file-name nil))
      (let ((vim-prefix "gnome-terminal -e 'vim") (vim-postfix "'"))
        (save-buffer) ;; First, write changes to disk
        (recenter) ;; Vim opens files with the view centred
        (shell-command-to-string (concat vim-prefix " "
                                         (shell-quote-argument buffer-file-name)
                                         " +"
                                         (number-to-string (line-number-at-pos))
                                         vim-postfix " &>/dev/null &")))
    ;; Not all buffers are associated with files
    (message "Not a real file")))
```

You can assign it a top level key binding for easy button mashing:

```lisp
(global-set-key [f12] 'open-in-vim)
```
