import React from "react";
import PropTypes from "prop-types";

import Drawing from "./drawing";

class Rate extends React.Component {
	static propTypes = {
		pages: PropTypes.arrayOf(PropTypes.shape({

		})),
		submitRating: PropTypes.func
	}

	render() {
		return (
			<div className="rate">
				<div className="rate-content">
					<div className="rate-header">
						<p className="rate-header-label">Gi poeng</p>
						<p>Trykk på tegninger eller ord for å gi poeng</p>
					</div>
					<ul>
						{this.props.pages.map(page => {
							if (page.type === "draw") {
								return (
									<li>
										<Drawing
											paths={page.answer.paths}
											{...page.answer.dimensions}
										/>
										<p className="rate-name">{page.playerName}</p>
									</li>
								);
							} else {
								return (
									<li>
										<p className="rate-guess">{page.answer}</p>
										<p className="rate-name">{page.playerName}</p>
									</li>
								);
							}
						})}
					</ul>
				</div>
			</div>
		);
	}
}

export default Rate;