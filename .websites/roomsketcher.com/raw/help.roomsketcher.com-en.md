[Skip to main content](https://help.roomsketcher.com/en/#page-container)

# oops

## The page you were looking for doesn't exist

You may have mistyped the address or the page may have moved


[Take me back to the home page](https://help.roomsketcher.com/hc "Home")

![](https://help.roomsketcher.com/en/)

New to RoomSketcher? [Start here →](https://help.roomsketcher.com/en/)





 <% var getColumnClasses = function(columnNumber) {
 var classNames = numberColumns === 'auto' ? 'col-auto' : 'col-12';
 if (numberColumns >= 2) classNames += ' md:col-6';
 if (numberColumns >= 3) classNames += ' lg:col-4';
 if (numberColumns >= 4) classNames += ' xl:col-3';
 return classNames;
 } %>
 <% var promotedArticlesAbove = 'none' !== 'none' && 'after' === 'before'; %>
 <% var notificationAbove = 'home' === 'home' && !!'HC\_notification\_content' && !window.sessionStorage.getItem('alpine:notification:dismissed'); %>


## ![](https://help.roomsketcher.com/en/)    Do More With Your Floor Plans

<% blocks.forEach(function(block, index) { %>
 - [<% if (imageHeight) { %>\\
\\
![](https://help.roomsketcher.com/en/)\\
\\
<% } %>\\
<% if (block.name) { %>\\
**<%= block.name %>**\\
<% } %>\\
<% if (block.description) { %>\\
\\
\\
<%= block.description %>\\
\\
\\
<% } %>](https://help.roomsketcher.com/en/)

<% }) %>



Want to see RoomSketcher in action?



[Join a Webinar](https://www.roomsketcher.com/webinars/)

### Categories

<% categories.forEach(function(category, index) { %>
 - [<%= category.name %>](https://help.roomsketcher.com/en/)



<%= partial('partial-article-list-sections', {
id: 'category-' + category.id,
parentId: '#sidebar-navigation',
sections: category.sections,
activeCategoryId: activeCategoryId,
activeSectionId: activeSectionId,
activeArticleId: activeArticleId,
partial: partial
}) %>



<% }); %>


 <% var maxSections = 5 %>


### Toggle navigation menu

<% categories.forEach(function(category, index) { %>
 - ### [<%= category.name %>](https://help.roomsketcher.com/en/)


<%= partial('partial-section-list-sections', { parent: category, sections: category.sections, maxSections: maxSections, partial: partial }) %>


<% }); %>


### Categories

### [Categories](https://help.roomsketcher.com/en/)

<% categories.forEach(function(category) { %>
 - [<%= category.name %>](https://help.roomsketcher.com/en/)

<% }); %>


 <% if (sections.length) { %>


 <% sections.forEach(function(section) { %>
 - [<%= section.name %>](https://help.roomsketcher.com/en/)



   <%= partial('partial-article-list-sections', {
   id: 'section-' + section.id,
   parentId: '#' + id,
   sections: section.sections,
   activeCategoryId: activeCategoryId,
   activeSectionId: activeSectionId,
   activeArticleId: activeArticleId,
   partial: partial
   }) %>


   <% if (section.articles.length) { %>

   <% section.articles.forEach(function(article) { %>
   - [<%= article.title %>](https://help.roomsketcher.com/en/)

 <% }); %>
 <% } %>



 <% }); %>


 <% } %>

 <% if (sections.length) { %>


 <% sections.slice(0, maxSections).forEach(function(section) { %>
 - [<%= section.name %>](https://help.roomsketcher.com/en/)
   <%= partial('partial-section-list-sections', { parent: section, sections: section.sections, maxSections: maxSections, partial: partial }) %>


 <% }); %>
 <% if (sections.length > maxSections) { %>
 - [See more](https://help.roomsketcher.com/en/)

 <% } %>


 <% } %>







Solve UI