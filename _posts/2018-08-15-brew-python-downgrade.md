---
title: How to downgrade Homebrew Python to 3.6
banner: /img/banners/mercy_street.jpg
---

A new Python version has been released, but TensorFlow
[does not yet support it](https://github.com/tensorflow/tensorflow/issues/20517)
on account of a breaking change with `async` and `await` being made reserved
keywords. Homebrew has updated their default python version to 3.7, and it is
quite difficult to find out how to downgrade. To save headaches, the answer is
that you need to install a the python formula from a version prior to the
update:

```sh
$ brew unlink python
$ brew install https://raw.githubusercontent.com/Homebrew/homebrew-core/e128fa1bce3377de32cbf11bd8e46f7334dfd7a6/Formula/python.rb
$ brew switch python 3.6.5
```

You can now `python -m pip install tensorflow` to your hearts content.
