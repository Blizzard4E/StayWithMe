    <script>
        import { onMount } from "svelte";
        import BackgroundStarsPink from "../../components/BackgroundStarsPink.svelte";
        import { transitionState } from "../../store";
        onMount(() => {
            transitionState.update(state => 0);
        })
    </script>
    <div class="container">
        <div class="grid">
            <div>
                <h1>Occupied</h1>
                <ul>
                    <li>
                        <h2>Room 100</h2>
                        <h3>Bed 2</h3>
                        <h3>By Someone</h3>
                        <button>Make Available</button>
                    </li>
                    <li>
                        <h2>Room 100</h2>
                        <h3>Bed 2</h3>
                        <h3>By Someone</h3>
                        <button>Make Available</button>
                    </li>
                    <li>
                        <h2>Room 100</h2>
                        <h3>Bed 2</h3>
                        <h3>By Someone</h3>
                        <button>Make Available</button>
                    </li>
                </ul>
            </div>
            <div>
                <h1>Available</h1>
                <ul>
                    <li>
                        <h2>Room 103</h2>
                        <h3>Bed 2</h3>
                    </li>
                    <li>
                        <h2>Room 103</h2>
                        <h3>Bed 2</h3>
                    </li>
                    <li>
                        <h2>Room 103</h2>
                        <h3>Bed 2</h3>
                    </li>
                </ul>
            </div>
            <div>
                <h1>Requests</h1>
                <ul>
                    <li>
                        <h2>Room 103</h2>
                        <h3>Bed 2</h3>
                        <h3>By Someone</h3>
                        <button>Accept</button>
                    </li>
                    <li>
                        <h2>Room 103</h2>
                        <h3>Bed 2</h3>
                        <h3>By Someone</h3>
                        <button>Accept</button>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <style lang="scss">
        ul {
            display: grid;
            row-gap: 1rem;
            li {
                position: relative;
                min-height: 130px;
                border: 1px solid black;
                padding: 1rem;
                transition: 0.15s ease-in-out;
                &:hover {
                    color: white;
                    border: none;
                    background-color: $pink2;
                    transform: scale(1.1);
                    z-index: 4;
                    button {
                        color: black;
                        background-color: white;
                    }
                }
                button {
                    position: absolute;
                    bottom: 5%;
                    right: 2%;
                    padding: 0.5rem;
                    background-color: $pink2;
                    border: none;
                    color: white;
                    transition: 0.15s ease-in-out;
                    cursor: pointer;
                    &:hover {
                        transform: scale(1.1);
                    }
                }

                h2 {
                    font-size: 1.1rem;
                }
                h3 {
                    font-size: .9rem;
                    font-weight: normal;
                }
            }
        }
        .grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            column-gap: 1rem;
        }
        .container {
            position: relative;
            z-index: 2;
            padding-top: 1rem;
            padding-bottom: 1rem;
            background-color: rgba(252, 247, 247, 0.7);
        }
        * {
            font-family: 'Poppins',sans-serif;
        }
    </style>
