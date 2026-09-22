/* =========================
   CREATE MAP
========================= */

const map = L.map("map").setView(
    [28.6139, 77.2090],
    11
);


/* =========================
   OPENSTREETMAP TILE LAYER
========================= */

L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution:
            "&copy; OpenStreetMap contributors"
    }
).addTo(map);


/* =========================
   MARKER STORAGE
========================= */

let markers = [];


/* =========================
   CREATE PLACE MARKERS
========================= */

places.forEach(place => {

    /*
        Create marker
    */

    const marker = L.marker([
        place.lat,
        place.lng
    ]);


    /*
        Create popup
    */

    marker.bindPopup(`

        <div class="place-popup">

            <h3>
                ${place.name}
            </h3>

            <span class="category">
                ${place.category}
            </span>

            <p>
                ${place.description}
            </p>

        </div>

    `);


    /*
        Store information
        inside marker
    */

    marker.placeCategory = place.category;

    marker.placeName = place.name;


    /*
        Store marker
        in markers array
    */

    markers.push(marker);


    /*
        Show marker
    */

    marker.addTo(map);

});


/* =========================
   DISPLAY PLACES IN SIDEBAR
========================= */

const placesList =
    document.getElementById("places-list");


function displayPlaces(placeArray) {

    /*
        Clear current list
    */

    placesList.innerHTML = "";


    /*
        Create card for
        every place
    */

    placeArray.forEach(place => {

        const card =
            document.createElement("div");


        card.className =
            "place-card";


        card.innerHTML = `

            <h3>
                ${place.name}
            </h3>

            <span class="place-category">
                ${place.category}
            </span>

            <p>
                ${place.description}
            </p>

        `;


        /*
            When card is clicked,
            move map to that place
        */

        card.addEventListener(
            "click",
            () => {

                map.setView(
                    [place.lat, place.lng],
                    15
                );


                /*
                    Find corresponding marker
                */

                const marker =
                    markers.find(
                        m =>
                        m.placeName === place.name
                    );


                /*
                    Open popup
                */

                if (marker) {

                    marker.openPopup();

                }

            }
        );


        /*
            Add card to sidebar
        */

        placesList.appendChild(card);

    });

}


/* =========================
   SHOW ALL PLACES INITIALLY
========================= */

displayPlaces(places);


/* =========================
   CATEGORY FILTERS
========================= */

const filterButtons =
    document.querySelectorAll(".filter");


filterButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            /*
                Remove active
                from all buttons
            */

            filterButtons.forEach(btn => {

                btn.classList.remove("active");

            });


            /*
                Make clicked button active
            */

            button.classList.add("active");


            /*
                Get selected category
            */

            const category =
                button.dataset.category;


            /*
                ALL
            */

            if (category === "all") {

                /*
                    Show all markers
                */

                markers.forEach(marker => {

                    marker.addTo(map);

                });


                /*
                    Show all cards
                */

                displayPlaces(places);

                return;
            }


            /*
                Filter places
            */

            const filteredPlaces =
                places.filter(
                    place =>
                    place.category === category
                );


            /*
                Hide all markers
            */

            markers.forEach(marker => {

                map.removeLayer(marker);

            });


            /*
                Show filtered markers
            */

            filteredPlaces.forEach(place => {

                const marker =
                    markers.find(
                        m =>
                        m.placeName === place.name
                    );


                if (marker) {

                    marker.addTo(map);

                }

            });


            /*
                Show filtered cards
            */

            displayPlaces(filteredPlaces);

        }
    );

});


/* =========================
   SEARCH
========================= */

const searchInput =
    document.getElementById("search");


searchInput.addEventListener(
    "input",
    () => {

        const query =
            searchInput.value
                .toLowerCase()
                .trim();


        /*
            If search is empty,
            show everything
        */

        if (query === "") {

            displayPlaces(places);


            markers.forEach(marker => {

                marker.addTo(map);

            });

            return;

        }


        /*
            Find matching places
        */

        const results =
            places.filter(place =>

                place.name
                    .toLowerCase()
                    .includes(query)

                ||

                place.category
                    .toLowerCase()
                    .includes(query)

                ||

                place.description
                    .toLowerCase()
                    .includes(query)

            );


        /*
            Hide all markers
        */

        markers.forEach(marker => {

            map.removeLayer(marker);

        });


        /*
            Show matching markers
        */

        results.forEach(place => {

            const marker =
                markers.find(
                    m =>
                    m.placeName === place.name
                );


            if (marker) {

                marker.addTo(map);

            }

        });


        /*
            Show matching cards
        */

        displayPlaces(results);

    }
);