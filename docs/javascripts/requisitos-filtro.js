(function () {
  function initializeRequirementFilter() {
    var input = document.getElementById("rf-filter-input");
    var result = document.getElementById("rf-filter-result");
    var container = document.querySelector(".rf-cards");
    var deliveryFilters = Array.prototype.slice.call(
      document.querySelectorAll('input[name="rf-delivery"]')
    );
    var situationFilters = Array.prototype.slice.call(
      document.querySelectorAll('input[name="rf-situation"]')
    );

    if (!input || !result || !container || !deliveryFilters.length || !situationFilters.length ||
        container.dataset.initialized === "true") {
      return;
    }

    container.dataset.initialized = "true";
    var cards = Array.prototype.slice.call(container.querySelectorAll(":scope > details"));

    function selectedValues(filters) {
      return filters
        .filter(function (filter) {
          return filter.checked;
        })
        .map(function (filter) {
          return filter.value;
        });
    }

    function filterCards() {
      var selectedDeliveries = selectedValues(deliveryFilters);
      var selectedSituations = selectedValues(situationFilters);
      var query = input.value.trim().toLocaleLowerCase("pt-BR");
      var visibleCount = 0;

      cards.forEach(function (card) {
        var summaryStatus = card.querySelector(".rf-summary-status");
        var delivery = summaryStatus && summaryStatus.children[0]
          ? summaryStatus.children[0].textContent
          : "";
        var situation = summaryStatus && summaryStatus.children[1]
          ? summaryStatus.children[1].textContent
          : "";
        var matchesDelivery = !selectedDeliveries.length ||
          selectedDeliveries.some(function (value) {
            return delivery.indexOf(value) !== -1;
          });
        var matchesSituation = !selectedSituations.length ||
          selectedSituations.some(function (value) {
            return situation.indexOf(value) !== -1;
          });
        var matchesSearch = !query ||
          card.textContent.toLocaleLowerCase("pt-BR").indexOf(query) !== -1;
        var matches = matchesDelivery && matchesSituation && matchesSearch;
        card.hidden = !matches;
        card.style.display = matches ? "" : "none";
        if (matches) {
          visibleCount += 1;
        }
      });

      result.textContent = "Exibindo " + visibleCount +
        (visibleCount === 1 ? " requisito." : " requisitos.");
    }

    deliveryFilters.concat(situationFilters).forEach(function (filter) {
      filter.addEventListener("change", filterCards);
    });
    input.addEventListener("input", filterCards);
    filterCards();
    openTargetCard();
  }

  function openTargetCard() {
    var hash = window.location.hash;
    if (hash && hash.length > 1) {
      try {
        var targetId = decodeURIComponent(hash.substring(1));
        var targetElem = document.getElementById(targetId);
        if (targetElem && targetElem.tagName.toLowerCase() === "details") {
          targetElem.open = true;
          targetElem.hidden = false;
          targetElem.style.display = "";
          setTimeout(function () {
            targetElem.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 150);
        }
      } catch (e) {}
    }
  }

  window.addEventListener("hashchange", openTargetCard);

  if (typeof document$ !== "undefined" && document$.subscribe) {
    document$.subscribe(function () {
      initializeRequirementFilter();
      openTargetCard();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      initializeRequirementFilter();
      openTargetCard();
    });
  } else {
    initializeRequirementFilter();
    openTargetCard();
  }
})();
