import React, { useState, useEffect } from "react";
import "../styles/Grid.css";

function Grid({ manifestData, selectedContainers, setSelectedContainers }) {
	const [gridData, setGridData] = useState([]);
    const [hoveredContainer, setHoveredContainer] = useState(null);

    const loadManifest = () => {
        const rows = 8;
        const cols = 12;
        const grid = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => ({ id: null, name: "NAN", weight: "0" }))
        );

        manifestData.split("\n").forEach((line) => {
            const [coordinates, weight, name] = line.split(", ");
            const row = parseInt(coordinates.substring(1, 3));
            const col = parseInt(coordinates.substring(4, 6));
            const rowIdx = 8 - row;
            const colIdx = col - 1;

            if (rowIdx >= 0 && colIdx >= 0 && rowIdx < rows && colIdx < cols) {
                grid[rowIdx][colIdx] = {
                    id: `${row},${col}`,
                    name: name.trim(),
                    weight: parseInt(weight.replace(/[{}]/g, ""), 10),
                };
            }
        });
        setGridData(grid);
    };

	const truncateText = (text, maxLength) => {
		return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
	};

  	const handleCellClick = (row, col, container) => {
		if (container.name === "UNUSED" || container.name === "NAN") return;
		const key = `[${8 - row},${col + 1}]`;
		const isSelected = selectedContainers.some((item) => item.position === key);

		if (isSelected) {
			setSelectedContainers(selectedContainers.filter((item) => item.position !== key));
		} else {
			setSelectedContainers([...selectedContainers, { position: key, name: container.name, weight: container.weight }]);
		}
  	};

    const handleCellHover = (cell, rowIndex, colIndex) => {
		if (cell) {
		setHoveredContainer({
			name: cell.name,
			weight: cell.weight,
			row: rowIndex,
			col: colIndex,
		});
		} else {
			setHoveredContainer(null);
		}
  	};

	useEffect(() => {
		loadManifest();
	}, [manifestData]);

  const displayGrid = () => {
	return gridData.map((row, rowIndex) => (
		<div key={`row-${rowIndex}`} className="grid-row">
			{row.map((cell, colIndex) => {
				let className;
				if (cell.name === "NAN") {
					className = "grid-cell nan";
				} else if (cell.name === "UNUSED") {
					className = "grid-cell unused";
				} else {
					className = selectedContainers.some(
					(item) => item.position === `[${8 - rowIndex},${colIndex + 1}]`
					)
					? "grid-cell used selected"
					: "grid-cell used";
				}

				const truncatedName = truncateText(cell.name, 8);

				return (
					<div
					key={`cell-${rowIndex}-${colIndex}`}
					className={className}
					onMouseEnter={() => handleCellHover(cell, rowIndex, colIndex)}
					onMouseLeave={() => handleCellHover(null)}
					onClick={() => handleCellClick(rowIndex, colIndex, cell)}
					>
					<span className="cell-text">{truncatedName}</span>
					{hoveredContainer &&
						hoveredContainer.name === cell.name &&
						hoveredContainer.row === rowIndex &&
						hoveredContainer.col === colIndex && (
						<div className="hover-popup">
							<p>{`Name: ${cell.name}`}</p>
							<p>{`Weight: ${cell.weight}kg`}</p>
						</div>
						)}
					</div>
				);
			})}
		</div>
    ));
  };

  return <div className="grid-container">{displayGrid()}</div>;
}

export default Grid;
