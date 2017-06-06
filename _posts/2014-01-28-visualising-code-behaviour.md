---
title: Visualising Code Behaviour
banner: /img/banners/derbyshire.jpg
---

I will be designing and implementing a micro-controller as part of my
University studies, and one of the optional activities that the course
professor suggested would be to write a disassembler for it. The
micro-controller uses a toy instruction-set capable of some primitive
logic and IO operations, and my approach to writing the disassembler
was to put together a minimal parser in JavaScript to decode the
opcodes and arguments from a list of instructions, and output an
address, mnemonic instruction name and human-readable description:

![Code](/images/2014-01-28-code.png)

The next logical step after disassembling the *what* of the code was
to investigate the *why* of the code. For this, we need a way of
visualising the flow of the program. For this, I turned to the
incredibly aptly named
[flowchart.js](http://adrai.github.io/flowchart.js/), which allowed to
me to very simply turn the linear list of instructions to a true
branching graph:

![Code](/images/2014-01-28-chart.png)

The
[source code](https://github.com/ChrisCummins/chriscummins.github.io/blob/064a7618caef8b08a798622b320ab019ec7b4931/js/ee4dsa-disassembler.js)
which implements it clocks in at under 200 lines of code, and one of
the reasons for this extreme brevity is the simplicity of the
instruction set, with a whopping six operations:

<table>
  <thead>
    <tr>
      <td>Opcode</td>
      <td>Instruction</td>
      <td>Description</td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>00</td>
      <td><code>IUC</code></td>
      <td>Increment unconditionally</td>
    </tr>
    <tr>
      <td>01</td>
      <td><code>HUC</code></td>
      <td>Halt unconditionally</td>
    </tr>
    <tr>
      <td>02</td>
      <td><code>BUC &lt;address&gt;</code></td>
      <td>Branch unconditionally</td>
    </tr>
    <tr>
      <td>03</td>
      <td><code>BIC &lt;address&gt;</code></td>
      <td>Branch conditionally</td>
    </tr>
    <tr>
      <td>04</td>
      <td><code>SETO &lt;port&gt; &lt;and&gt; &lt;xor&gt;</code></td>
      <td>Set outputs</td>
    </tr>
    <tr>
      <td>05</td>
      <td><code>TSTI &lt;port&gt; &lt;and&gt; &lt;xor&gt;</code></td>
      <td>Test inputs</td>
    </tr>
  </tbody>
</table>

The disassembler and code visualiser are packaged into an interactive
web application here:

<div class="btn-row">
<a href="/u/aston/uc/disassembler/" class="btn btn-primary" target="_blank">uC Disassembler</a>
</div>
