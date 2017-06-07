---
title: Made with love, tears, and bootstrap
banner: /img/banners/holyrood-park.jpg
---

We're back with a fresh new look. Out with the old, in with the new.

Old design was nice, but was a little sparse and scaled poorly: 

![]({{ '/img/2017/revamp-old-site-home.png' | relative_url }})

Mockup in [Balsamiq](https://balsamiq.com/). Made some tweaks: no more fixed "500px is good enough for desktop+mobile+tablet", and compress the sidebar on single-column view:

![]({{ '/img/2017/revamp-iteration-1.png' | relative_url }})

However, when you change one thing, you may as well go ahead and tick all of the things off the wishlisht. new design to double down on a complete overhaul and go for "hero image" branding:

![]({{ '/img/2017/revamp-iteration-2.png' | relative_url }})

Things I didn't like: the title was floating amidst the image, and when compressed down to single column width that would awkwardly sandwich my name amongst the title and the content. Also, right-side navigation is in-vogue. Let's iterate:

![]({{ '/img/2017/revamp-iteration-3.png' | relative_url }})

Nice, I like that. High fidelity mockup in [OmniGraffle](https://www.omnigroup.com/omnigraffle/):

![]({{ '/img/2017/revamp-mockup-home.png' | relative_url }})

Time to implement. [Bootstrap](https://getbootstrap.com/) with a bunch of SASS and a sprinkle of jQuery. Revamped CV - before and after:

![]({{ '/img/2017/revamp-cv.png' | relative_url }})

blog - before and after:

![]({{ '/img/2017/revamp-blog.png' | relative_url }})

portfolio - before and after:

![]({{ '/img/2017/revamp-portfolio.png' | relative_url }})

things I like:

* subtle animations: sticky scroll on the right column, and pop my name over there when the hero image is out of view. parallax behind hero image
* using a lot more templating: e.g. `relative_url` for a staging site.
* all of the content for the resume and portfolio are stored in a single JSON file, programatically instantiated by Jekyll to generate HTML.
* dates next to titles "hang right" on desktop, but on narrow displays where real estate is limited, they slip under the title
* mobile scaling:

![]({{ '/img/2017/revamp-mobile.png' | relative_url }})
