---
layout: page
title: Publications
permalink: /publications/
image: pub_pic.jpg
---

Publications by categories in reversed chronological order. 

<!-- _pages/publications.md -->
<div class="publications">

{%- for y in page.years %}
  <h2 class="year">{{y}}</h2>
  {% bibliography -f papers -q @*[year={{y}}]* %}
{% endfor %}

</div>